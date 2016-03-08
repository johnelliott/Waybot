// Make a node app that takes counter module, request module, and some config and creates a deployable thing to register with wb-cloud and be a stop watch

// here are the counter methods I'd like
// counter.start
// counter.stop
// counter.reset
// but now I have reset and print-all, so I'll use those

require("./config");
var debug = require('debug')('wb-uploader:index');
// Default to Ras. Pi USB
var localSerialPort = process.env.SERIALPORT || "/dev/ttyACM0";
var uploadHost = process.env.API_HOST || "http://localhost:5984/data";
var http = require('http');
var Counter = require("./lib/counter");
var upload = require("./lib/upload");

var counter = new Counter(localSerialPort, function counterCallback (err, data) {
    if (err) {
        console.log('Error connecting to counter (connect a counter)');
        debug('Error:', err);
        process.exit(1);
    }
    debug('Data', data);
    // No cache or db for now, just upload to server
    upload(uploadHost, data);

});

var server = http.createServer(function requestHandler (req, res) {
  if (req.method === 'GET') {
      counter.getJSON(function getHandler(err, data) {
        if (err) {
            res.writeHead(503);
            res.end('Error');
        }
        res.writeHead(200);
        res.end(data);
      });
  } else if (req.method === 'DELETE') {
    counter.reset(function resetHandler(err, data) {
        if (err) {
            res.writeHead(200);
            res.end('Error');
        }
        res.writeHead(200);
        res.end(data);
    });
  } else {
    res.writeHead(200);
    res.end('What method is this');
  }
});

server.listen(3000);
debug('Server lisening on 3000');
