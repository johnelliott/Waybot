// Make a node app that takes counter module, request module, and some config and creates a deployable thing to register with wb-cloud and be a stop watch

// here are the counter methods I'd like
// counter.start
// counter.stop
// counter.reset
// but now I have reset and print-all, so I'll use those

require("./config");
// Default to Ras. Pi USB
var localSerialPort = process.env.SERIALPORT || "/dev/ttyACM0";
var Counter = require("./lib/counter");
var counter = new Counter(localSerialPort);

// here are the http methods I'd like
// /api/counter/*/start
// /api/counter/*/stop
// /api/counter/*/reset
// does this thing need its own rest api?
var http = require('http');

var server = http.createServer((req, res) => {
  if (req.url === '/get') {
    var counterData = counter.getJSON();
    // TODO the problem here is I can't catch the JSON
    res.writeHead(200);
    res.end('hello world', counterData);
  }
  else {
    res.writeHead(200);
    res.end('what route is this');
  }
});

server.listen(3000);
console.log('server lisening on 3000');
