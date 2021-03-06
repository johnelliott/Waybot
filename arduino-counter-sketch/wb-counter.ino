/***************************************************************
 *
 * Do-It-Yourself TRAFFIC COUNTER
 * Developed by Tomorrow Lab in NYC 2012
 * Developer: Ted Ullricis_measuringh <ted@tomorrow-lab.com>
 * http://tomorrow-lab.com
 *
 * Materials List:
 * http://bit.ly/OqVIgj
 *
 * This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
 * Please include credit to Tomorrow Lab in all future versions.
 *
 * I modified this to use JSON, among other changes - John Elliott
 *
 ***************************************************************/

#include <ArduinoJson.h>
#include <EEPROM.h>
#include "EEPROMAnything.h"
#define MEM_SIZE 512 //EEPROM memory size (remaining 2 bytes reserved for count)
#define NOTE_C6  1047
#define NOTE_E6  1319
#define NOTE_G6  1568

int counter_id = 1; // serial number of the counter
int trigger_value; // pressure reading threshold for identifying a bike is pressing.
int threshold = 1; //change this amount if necessary. tunes sensitivity.
int the_tally; //total amount of sensings.
int incomingByte = 0;   // for incoming serial data
int the_time_offset; // in case of power out, it starts counting time from when the power went out.
// TODO see if I am using latest_minute
int latest_minute;
int the_wheel_delay = 50; //number of milliseconds to create accurate readings for cars. prevents bounce.
int car_timeout = 3000;
long the_wheel_timer; //for considering that double wheel-base of cars, not to count them twice.
int the_max = 0;
int is_measuring = 0;
int count_this = 0;
int strike_number = 0;
float wheel_spacing = 1.7500; //average spacing between wheels of car (METERS)
float first_wheel = 0.0000000;
float second_wheel= 0.0000000;
float wheel_time = 0.0000000;
float the_speed = 0.0000000;
int time_slot;
int speed_slot;
int all_speed;
// notes in the melody:
int melody[] = {NOTE_C6, NOTE_G6};
int noteDurations[] = {8,8};

void setup() {

  // set up pins
  pinMode(A0, INPUT);
  pinMode(2, OUTPUT);
  pinMode(13, OUTPUT); //buzzer too

  // start serial port
  Serial.begin(9600);

  // update the tally variable from memory:
  EEPROM_readAnything(0,  the_tally); //the tally is stored in position 0. assigns the read value to 'the_tally'.
  EEPROM_readAnything((the_tally*2)+1, the_time_offset); //read the last time entry

  if (the_tally < 0) { //for formatting the EEPROM for a new device.
    erase_memory();
  }



  // read local air pressure and create offset.
  trigger_value = analogRead(A0) + threshold;
  delay(1000);
}

void loop() {
  //1 - TUBE IS PRESSURIZED INITIALLY
  if (analogRead(A0) > trigger_value) {
    if (strike_number == 0 && is_measuring == 0) { // FIRST HIT
      // Serial.println("");
      // Serial.println("Car HERE. ");
      first_wheel = millis();
      is_measuring = 1;
    }
    if (strike_number == 1 && is_measuring == 1) { // SECOND HIT
      // Serial.println("Car GONE.");
      second_wheel = millis();
      is_measuring = 0;
    }
  }


  //2 - TUBE IS STILL PRESSURIZED
  while(analogRead(A0) > the_max && is_measuring == 1) { //is being pressed, in all cases. to measure the max pressure.
    the_max = analogRead(A0);
  }


  //3 - TUBE IS RELEASED
  if (analogRead(A0) < trigger_value - 1 && count_this == 0) { //released by either wheel
    if (strike_number == 0 && is_measuring == 1 && (millis() - first_wheel > the_wheel_delay)) {
      strike_number = 1;
    }
    if (strike_number == 1 && is_measuring == 0 && (millis() - second_wheel > the_wheel_delay) ) {
      count_this = 1;
    }
  }


  //4 - PRESSURE READING IS ACCEPTED AND RECORDED
  if ((analogRead(A0) < trigger_value - 1) && ((count_this == 1 && is_measuring == 0) || ((millis() - first_wheel) > car_timeout) && is_measuring == 1)) { //has been released for enough time.
    make_tone(); //will buzz if buzzer attached, also LED on pin 13 will flash.
    the_tally++;
    time_slot = the_tally*2;
    speed_slot = (the_tally*2)+1;
    // Serial.print("Pressure Reached = ");
    // Serial.println(the_max);
    // Serial.print("Current Count = ");
    // Serial.println(the_tally);
    // Write the configuration struct to EEPROM
    // EEPROM_writeAnything(0, the_tally); //puts the value of x at the 0 address.
    //Serial.print("time between wheels = ");
    wheel_time = ((second_wheel - first_wheel)/3600000);
    //Serial.println(wheel_time);
    int time = (millis()/1000) + the_time_offset + 1; // the number of seconds since first record.
    EEPROM_writeAnything(time_slot, time); //puts the value of y at address 'the_tally'.
    the_speed = (wheel_spacing/1000)/wheel_time;
    if (the_speed > 0 ) {
      EEPROM_writeAnything(speed_slot, int(the_speed)); //puts the value of y at address 'the_tally'.
      print_hit(time, the_speed);
    }
    else {
      EEPROM_writeAnything(speed_slot, 0); //puts the value of y at address 'the_tally'.
      print_hit(time, 0);
    }

    //RESET ALL VALUES
    the_max = 0;
    strike_number = 0;
    count_this = 0;
    is_measuring = 0;

  }


  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingByte = Serial.read();
    if (incomingByte == '1') {
      print_memory();
    }
    if (incomingByte == '2') {
      erase_memory();
    }
  }
}

void print_message(String message){
  Serial.println("{\"message\":\"" + message + "\"}");
}

void print_hit(int hit_time, int hit_speed){
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  // establish which counter we'll use in json structure
  root["counter_id"] = counter_id;
  JsonObject& hit = root.createNestedObject("hit");
  hit["time"] = hit_time;
  hit["speed"] = hit_speed;
  root.printTo(Serial);
  // make this work with readline parser
  Serial.print("\n");
}

void print_memory(){
  StaticJsonBuffer<400> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  // establish which counter we'll use in json structure
  root["counter_id"] = counter_id;
  root["tally"] = the_tally;
  JsonArray& hits = root.createNestedArray("hits");
  if (the_tally > 0) {
    for (int i=1; i<= the_tally; i++) {
      long time = EEPROM.read(2*i);
      // TODO could speed be an int?
      long speed = EEPROM.read((2*i)+1);
      JsonObject& hit = hits.createNestedObject();
      hit["time"] = time;
      hit["speed"] = speed;
    }
  }
  root.printTo(Serial);
  // make this work with readline parser
  Serial.print("\n");
}

void raw_print_memory(){

  Serial.println("EEPROM REPORT: ");
  Serial.print("[");
  for (int i = 0; i <= MEM_SIZE; i++)
  {
    int h = EEPROM.read(i);
    Serial.print(h);
    if (i < MEM_SIZE)
    Serial.print(",");
  }
  Serial.println("]");

}

void erase_memory() {
  //erase current tally
  Serial.println("");
  Serial.println("ERASING MEMORY ...");
  for (int i = 0; i <= MEM_SIZE; i++){
    EEPROM.write(i, 0);
  }
  the_tally = 0;
  the_time_offset = 0;
  latest_minute = 0;
}

void make_tone() {
  for (int thisNote = 0; thisNote < 2; thisNote++) {

    //to calculate the note duration, take one second
    //divided by the note type.
    //e.g. quarter note = 1000 / 4, eighth note = 1000/8, etc.
    int noteDuration = 1000/noteDurations[thisNote];
    tone(13, melody[thisNote],noteDuration);

    //to distinguish the notes, set a minimum time between them.
    //the note's duration + 30% seems to work well:
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
    //stop the tone playing:
    noTone(13);
  }
}

