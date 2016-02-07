var serialPort = require('serialport');

module.exports = function Init (port, dataHandler) {

    // Create a serial port that handles data callbacks;
    // don't open it yet
    var sp = new serialPort.SerialPort(port, {
        parser: serialPort.parsers.readline("\n"),
        baudrate: 9600
    }, false);

    // Open serial connection
    sp.open(function (err) {
        if (err) {
            console.log("Failed to open serial port", error);
            throw error;
        }
        console.log("Serial port open", sp.path, sp.isOpen());
        sp.on("data", function(data) {
            console.log("Incoming data ->", typeof data, data);
            try {
                var jsonData = JSON.parse(data);
                console.log('JSON parsed:', jsonData);
                dataHandler(null, jsonData);
            }
            catch (err) {
                console.log('Error parsing data', err);
            }
        });
    });

    // Get full contents of counter memory as JSON
    function dumpMemory (callback) {
      writeAndDrain('1', callback);
    }

    // Tell counter to erase internal memory
    function clearMemory (callback) {
      writeAndDrain('2', callback);
    }

    function writeAndDrain (data, callback) {
        sp.write(data, function (err, results) {
            if (err) {
                console.log("error in writeAndDrain", err);
            }
            console.log('results', results);
            sp.drain(callback);
        });
    }

    return {
        getJSON: dumpMemory,
        reset: clearMemory
    };
};
