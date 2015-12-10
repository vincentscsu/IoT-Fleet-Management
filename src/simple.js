var express = require('express');
var app = express();

PORT = 8080;

var str = 'Hello from Black Pearl1!';

app.get('/', function (req, res) {
  res.send(str);
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});


module.exports = str;
