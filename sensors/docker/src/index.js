var dgram = require('dgram');

// Constants
var MY_PORT = 1357;
var MY_HOST = require('./ip')();
var TARGET_PORT = 1234;
var TARGET_HOST = '192.168.1.115'


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
