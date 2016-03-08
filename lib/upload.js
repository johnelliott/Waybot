// Module to make POST requests to wb-cloud
var http = require('http');
var url = require('url');
var debug = require('debug')('wb-uploader:upload');

module.exports = function upload (host, data) {
    try {
        var postData = JSON.stringify(data);
    } catch (err) {
        debug('error in json stringification', err);
    }
    try {
        var parsedHost = url.parse(host);
        debug('parsed host', parsedHost);
    } catch (err) {
        debug(`problem with host: ${err.message}`); // Can i use tempalte strings?
    }

    // TODO looks like a good place for spread or something...
    var options = {
      hostname: parsedHost.hostname,
      port: parsedHost.port,
      path: parsedHost.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    var req = http.request(options, (res) => {
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

    // write data to request body
    req.write(postData);
    req.end();
}
