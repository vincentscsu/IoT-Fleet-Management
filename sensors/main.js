'use strict'

var grove = require('./grove');
var gpio = require('rpi-gpio');
var dgram = require('dgram');

var board = new grove.Board();

var PORT = 1234;
var HOST = require('./ip')();

var pir_pin = 12;
var pir_reading = false;
gpio.on('change', function(channel, value) {
    pir_reading = value;
});
gpio.setup(pir_pin, gpio.DIR_IN, gpio.EDGE_BOTH);
console.log("PIR sensing app up and running");

function readValues() {
    console.log("Light: " + board.readLight());
//    console.log("Temp: " + board.readTemp());
  //  console.log("PIR: " + pir_reading);
}
setInterval(readValues, 1000);


var server = dgram.createSocket('udp4');
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    message = ("" +message).split(":");
    console.log(message);
    var res_host = message.shift();
    var res_port = message.shift();
    var response = "";
    for (var i = 0; i < message.length; i++) {
	if (message[i] == "temp") {
	    response += "temp:"+board.readTemp().toFixed(2) + ";";
	} else if (message[i] == "light") {
	    response += "light:"+board.readLight().toFixed(2) + ";";
	} else if (message[i] == "pir") {
	    response += "pir:"+readPir() + ";";
	} else {
	    response += "unrecognized";
	}
    }
	
    var client = dgram.createSocket('udp4');
    var data = new Buffer(response);
    client.send(data, 0, data.length, res_port, res_host, function(err, bytes) {
	if (err) {
	    console.log('UDP Server error: ' + err);
	    client.close();
	}
    });
    
});
server.bind(PORT, HOST);
