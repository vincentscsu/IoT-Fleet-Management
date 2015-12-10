'use strict'

var grove = require('./grove');
var gpio = require('rpi-gpio');
var dgram = require('dgram');
var http = require('http');

var board = new grove.Board();

var PORT = 1234;
var HOST = require('./ip')();
var MASTER = '192.168.1.83';

/*********************
 ***** PIR SETUP *****
 *********************/
var pir_pin = 12;
var pir_reading = false;
gpio.on('change', function(channel, value) {
    pir_reading = value;
});
gpio.setup(pir_pin, gpio.DIR_IN, gpio.EDGE_BOTH);
console.log("PIR sensing app up and running");

/*******************
 ***** TESTING *****
 *******************/
function readValues() {
    console.log("Light: " + board.readLight());
    console.log("Temp: " + board.readTemp());
    console.log("PIR: " + pir_reading);
}
setInterval(readValues, 1000);





/***********************
 ***** UPDATE DASH *****
 ***********************/
function sendPir() {
    var pir_data = JSON.stringify({
        auth_token : "YOUR_AUTH_TOKEN", 
        text : pir_reading ? "Motion Detected" : "No Motion"
    });

    var options = {
	host: MASTER,
	port: 3030,
	path: '/widgets/motion',
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': Buffer.byteLength(pir_data)
	}
    };

    var req = http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	    console.log("body: " + chunk);
	});
    });
    req.write(pir_data);
    req.end();
    console.log("sent: " + pir_data);
}

function sendTemp() {
    var pir_data = JSON.stringify({
        auth_token : "YOUR_AUTH_TOKEN", 
        value : (board.readTemp() | 0) 
    });

    var options = {
	host: MASTER,
	port: 3030,
	path: '/widgets/temperature',
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': Buffer.byteLength(pir_data)
	}
    };

    var req = http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	    console.log("body: " + chunk);
	});
    });
    req.write(pir_data);
    req.end();
    console.log("sent: " + pir_data);
}

var start_time = new Date;
var light_data = [{"x": (new Date - start_time)/1000 | 0, "y":board.readLight() | 0}];

function sendLight() {
    light_data.push({"x": (new Date - start_time)/1000 | 0, "y":board.readLight() | 0});
    if (light_data.length > 10) {
	light_data.pop();
    }
    var pir_data = JSON.stringify({
        auth_token : "YOUR_AUTH_TOKEN", 
	points : light_data
    });

    var options = {
	host: MASTER,
	port: 3030,
	path: '/widgets/light',
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': Buffer.byteLength(pir_data)
	}
    };

    var req = http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
	    console.log("body: " + chunk);
	});
    });
    req.write(pir_data);
    req.end();
    console.log("sent: " + pir_data);
}

function sendAll() {
    sendPir();
    sendTemp();
    sendLight();
}
setInterval(sendAll, 2000);



/**************************
 ***** SERVER RESPOND *****
 **************************/
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

