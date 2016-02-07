// Module to make POST requests to wb-cloud
var http = require('http');
var debug = require('debug')('wb-node:uploader');

module.exports = function upload (data) {
    var postData = JSON.stringify(data);

    var options = {
      hostname: 'localhost',
      port: 3001,
      path: '/upload',
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
