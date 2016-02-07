// Make a node app that takes counter module, request module, and some config and creates a deployable thing to register with wb-cloud and be a stop watch

// here are the counter methods I'd like
// counter.start
// counter.stop
// counter.reset
// but now I have reset and print-all, so I'll use those

require("./config");
// Default to Ras. Pi USB
var localSerialPort = process.env.SERIALPORT || "/dev/ttyACM0";
var http = require('http');
var Counter = require("./lib/counter");

var counter = new Counter(localSerialPort, function counterCallback (err, data) {
    if (err) {
        console.log('Error', err);
    }
    try {
        var jsonData = JSON.parse(data);
        console.log('JSON data', data);
    }
    catch (err) {
        console.log('Error parsing data', err);
    }
});

var server = http.createServer((req, res) => {
  if (req.method === 'GET') {
      counter.getJSON(function getHandler(err, data) {
        if (err) {
            res.writeHead(503);
            res.end('Error');
        }
        res.writeHead(200);
        res.end(JSON.stringify(data));
      });
  } else if (req.method === 'DELETE') {
    counter.reset(function resetHandler(err, data) {
        if (err) {
            res.writeHead(200);
            res.end('Error');
        }
        res.writeHead(200);
        res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(200);
    res.end('What method is this');
  }
});

server.listen(3000);
console.log('Server lisening on 3000');