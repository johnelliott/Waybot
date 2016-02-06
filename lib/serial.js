// serial port
var serialPort = require("serialport");

// Create a serial port that handles data callbacks;
// don't open it yet
// TODO this is taking a callback, why? maybe just default feedback loop
module.exports = function WaybotPortConstructor (port, dataCallback) {
  var sp = new serialPort.SerialPort(port, {
    parser: serialPort.parsers.readline("\n"),
    baudrate: 9600
  }, true);

  sp.on("data", dataCallback);

  return sp;
};
