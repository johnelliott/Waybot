var Serialport = require("./serial");

module.exports = function Init (port) {
    var sp = new Serialport(port, function(data) {
      console.log("data from counter:", data);
    });

    // Get full contents of counter memory as JSON
    function dumpMemory () {
      sp.write('1');
    }

    function clearMemory () {
      sp.write('2');
    };

    return {
        isOpen: sp.isOpen,
        getJSON: dumpMemory,
        reset: clearMemory
    };
};

