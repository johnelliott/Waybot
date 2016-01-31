// Help out guessing a serial port if one is not set
if (!process.env.SERIALPORT) {
    var os = require('os');
    // default serial port to Raspberry Pi model b USB
    process.env.SERIALPORT = os.platform() === "darwin" ?
        "/dev/cu.usbmodem1421" : "/dev/ttyACM0";
}
