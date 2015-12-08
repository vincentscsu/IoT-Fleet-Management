var dgram = require('dgram');

// Constants
var MY_PORT = 1337;
var MY_HOST = require('./ip')();
var TARGET_PORT = 1338;
var TARGET_HOST = '192.168.1.115'


// request info every second
function request() {
    var client = dgram.createSocket('udp4');
    var data = new Buffer(MY_HOST+':'+MY_PORT);
    client.send(data, 0, data.length, TARGET_PORT, TARGET_HOST, function(err, bytes) {
	if (err) {
	    console.log('UDP Server error: ' + err);
	    client.close();
	}
    });
}
setInterval(request, 1000);

// receive
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    console.log("UDP Server listening.");
});
server.on('message', function (message, remote) {
    console.log("Response received: " + message);
});
server.bind(MY_PORT, MY_HOST);
