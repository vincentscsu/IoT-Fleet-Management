var dgram = require('dgram');

var PORT = 1338;
var HOST = require('./ip')();

// central server
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    message = ''+message
    var res_host = message.split(":")[0];
    var res_port = message.split(":")[1];
    
    var client = dgram.createSocket('udp4');
    var data = new Buffer('' + new Date);
    client.send(data, 0, data.length, res_port, res_host, function(err, bytes) {
	if (err) {
	    console.log('UDP Server error: ' + err);
	    client.close();
	}
    });

    console.log("Message from " + message);
    
});
server.bind(PORT, HOST);
