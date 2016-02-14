/* How to use this
 *
 * SERIALPORT=/dev/ttys001 && node faker.js |cat > SERIALPORT
 *
 * ...or something like that
 */

var faketime = 0;
var interval = 1750;
setInterval(function(){
    faketime += 2;
    var message = '{"time":' + Math.floor(faketime) + ',"speed":' + Math.floor(Math.random()*30) + '}\n';
    process.stdout.write(message);
}, interval);
