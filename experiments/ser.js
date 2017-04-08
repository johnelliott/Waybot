// deps
var http = require('http');
var url = require('url');
var serialPort = require('serialport');
var debug = require('debug')('serialtest');
// config
var localSerialPort = "/dev/cu.usbmodem1431";
var uploadHost = "http://localhost:5984/data/";

debug('NOTE THE HARD-CODED PORTS....');

// create serial connection
var sp = new serialPort.SerialPort(localSerialPort, {
    parser: serialPort.parsers.readline("\n"),
    baudrate: 9600,
    autoOpen: true
});


// I am not really sure what this file is, see near the bottom...

// wait for connection
sp.on('open', function openEventHandler () {
    debug("Serial port open", sp.path, sp.isOpen());
    // log out what we get back
    sp.on("data", function(data) {
        debug("Incoming typeof=", typeof data, "->", data);
        try {
            var jsonData = JSON.parse(data);
        }
        catch (err) {
            debug('Error parsing data', err);
        } finally {
            debug('JSON parsed:', jsonData);
        }
    });
    sp.on("finish", function() {
        debug('sp finished');
    });
    sp.on("end", function() {
        debug('sp ended');
    });
});

try {
    var parsedHost = url.parse(uploadHost);
    debug('parsed host', parsedHost);
} catch (err) {
    debug(`problem with host: ${err.message}`); // Can i use tempalte strings?
}

var requestOptions = {
  hostname: parsedHost.hostname,
  port: parsedHost.port,
  path: parsedHost.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var req = http.request(requestOptions, (res) => {
  debug(`STATUS: ${res.statusCode}`);
  debug(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    debug(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    debug('No more data in response.')
  })
});

req.on('error', (e) => {
  debug(`problem with request: ${e.message}`);
});

req.on('connect', (e) => {
  debug(`connected: ${e.message}`);
});



// do the piping here in this file
// and then run DEBUG=serialtest nodemon ser.js
//sp.pipe(req);

/*
or run DEBUG=serialtest node
then in the repl:
var ser = require('./ser.js')
along with one of the following:
ser.sp.pipe(process.stdout) for testing
ser.sp.pipe(ser.req) for trying to post into couchdb
then in another terminal $ echo -n a > cu.usbmodem14121
and check with $ curl -s -XGET localhost:5984/serialtest/|json_pp |grep doc_count
don't forget to make sure this couch databse serialtest exists or it won't work....
*/

exports.req = req;
exports.sp = sp;
