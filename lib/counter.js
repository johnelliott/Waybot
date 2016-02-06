var serialPort = require("serialport");

module.exports = function Init (port, dataHandler) {

    var sp = new serialPort.SerialPort(port, {
        parser: serialPort.parsers.readline("\n"),
        baudrate: 9600
    }, true);
    sp.on("data", dataHandler);

    // Get full contents of counter memory as JSON
    function dumpMemory (callback) {
      sp.write('1', callback);
    }

    // Tell counter to erase internal memory
    function clearMemory (callback) {
      sp.write('2', callback);
    }

    return {
        getJSON: dumpMemory,
        reset: clearMemory
    };
};
