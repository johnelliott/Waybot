var os = require('os');
var debug = require('debug')('wb-uploader:lib:counter');
var serialPort = require('serialport');

var defaultPort = os.platform() === "darwin" ? "/dev/cu.usbmodem1431" : "/dev/ttyACM0";
var port = process.env.SERIALPORT || defaultPort;

module.exports = function Init (dataHandler) {
    // Create a serial port that handles data callbacks;
    // don't open it yet
    var sp = new serialPort.SerialPort(port, {
        parser: serialPort.parsers.readline("\n"),
        baudrate: 9600,
        autoOpen: true
    });

    // Open serial connection
    sp.on('open', function openEventHandler () {
        debug("Serial port open", sp.path, sp.isOpen());
        sp.on("data", function(data) {
            debug("Incoming data ->", typeof data, data);
            try {
                var jsonData = JSON.parse(data);
                dataHandler(null, jsonData);
            }
            catch (err) {
                debug('Error parsing data', err);
                dataHandler(err);
            } finally {
                debug('JSON parsed:', jsonData);
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
                debug("error in writeAndDrain", err);
            }
            debug('results', results);
            sp.drain(function() {
                callback(err, data);
            });
        });
    }

    return {
        getJSON: dumpMemory,
        reset: clearMemory
    };
};
