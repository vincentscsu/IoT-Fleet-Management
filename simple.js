var express = require('express');
var app = express();

var str = 'Hello from Black Pearl #1!';

app.get('/', function (req, res) {
  res.send(str);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});


module.exports = str;
