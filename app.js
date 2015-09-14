'use strict';
var express = require('express');
var app = express();
var http = require('http');

var port = 3333;

app.use(require('morgan')('dev'));
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render(__dirname + '/index.html');
});

app.get('/file', function (req, res) {
  res.download(__dirname + '/test.pdf', 'test.pdf');
});

app.get('/broken', function (req, res) {
  var options = {
    method: 'GET',
    host: 'localhost',
    port: port,
    path: '/file'
  };

  var request = http.request(options, function(response) {
    var data = '';

    response.on('data', function(chunk) {
      data += chunk;
    });

    response.on('end', function() {
      console.log('requested content length: ', response.headers['content-length']);
      console.log('parsed content length: ', data.length);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=broken-test.pdf',
        'Content-Length': data.length
      });
      res.end(data);
    });
  });

  request.end();
});

app.get('/download', function (req, res) {
  var options = {
    method: 'GET',
    host: 'localhost',
    port: port,
    path: '/file',
    encoding: null
  };

  var request = http.request(options, function(response) {
    var data = [];

    response.on('data', function(chunk) {
      data.push(chunk);
    });

    response.on('end', function() {
      data = Buffer.concat(data);
      console.log('requested content length: ', response.headers['content-length']);
      console.log('parsed content length: ', data.length);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=working-test.pdf',
        'Content-Length': data.length
      });
      res.end(data);
    });
  });

  request.end();
});

app.listen(port);
