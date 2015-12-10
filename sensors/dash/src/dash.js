var dgram = require('dgram');
var http = require('http');

// Constants
var ip = require('./ip')();
var MY_PORT = 1337;
var MY_HOST = ip;
var TARGET_PORT = 1234;
var TARGET_HOST = ip;
var MASTER = ip;
    
var pir = null;
var light = null;
var temp = null;

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
function requestAll() {
    request(":light:temp:pir");
}
setInterval(requestAll, 500);

// receive
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    console.log("UDP Server listening.");
});
server.on('message', function (message, remote) {
    message = ("" + message).split(";");
    for (var i = 0; i < message.length; i++) {
	msg = message[i].split(":");
	console.log(msg);
	if (msg[0] == "light") {
	    if (parseInt(msg[1]) > 0) 
		light = msg[1];
	} else if (msg[0] == "temp") {
	    if (parseInt(msg[1]) > 0) 
		temp = msg[1];
	} else if (msg[0] == "pir") {
	    pir = msg[1];
	}
    }
});
server.bind(MY_PORT);


/***********************
 ***** UPDATE DASH *****
 ***********************/
function sendPir() {
    if (pir != null) {
	var pir_data = JSON.stringify({
            auth_token : "YOUR_AUTH_TOKEN",
            text : pir == "true" ? "Motion Detected" : "No Motion"
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
}

function sendTemp() {
    if (temp != null) {
	var pir_data = JSON.stringify({
            auth_token : "YOUR_AUTH_TOKEN", 
            value : (temp | 0) 
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
}

var start_time = null;
var light_data = []
function sendLight() {
    if (light != null) {
	if (start_time == null) {
	    start_time = new Date;
	}
	light_data.push({"x": (new Date - start_time)/1000 | 0, "y": light | 0});
	if (light_data.length > 10) {
	    light_data.shift();
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
}
function sendAll() {
    sendPir();
    sendTemp();
    sendLight();
}
setInterval(sendAll, 2000);
