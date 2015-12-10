var dgram = require('dgram');
var express = require('express');
var app = express();

// Constants
var ip = require('./ip')();
var MY_PORT = 1357;
var MY_HOST = ip;
var TARGET_PORT = 1234;
var TARGET_HOST = ip;
var DISPLAY_PORT = 8080; 

// to check if the app is up and running
app.get('/', function(req, res) {
  res.send('User app is up and running on this node!');
});

app.listen(DISPLAY_PORT);

// request info every second
function request(request) {
    var client = dgram.createSocket('udp4');
    var data = new Buffer(MY_HOST+':'+MY_PORT+request);
    client.send(data, 0, data.length, TARGET_PORT, TARGET_HOST, function(err, bytes) {
	if (err) {
	    console.log('UDP Server error: ' + err);
	    client.close();
	}
    });
}

function requestTemp() {
    request(":temp");
}
function requestAll() {
    request(":light:temp:pir");
}
setInterval(requestTemp, 1000);
setInterval(requestAll, 5000);

// receive
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    console.log("UDP Server listening.");
});
server.on('message', function (message, remote) {
    message = ("" + message).split(";");
    for (var i = 0; i < message.length; i++) {
	console.log(message[i].split(":"));
    }
});
server.bind(MY_PORT, MY_HOST);
