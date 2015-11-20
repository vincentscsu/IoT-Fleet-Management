'use strict';

var http = require('http');
var url = require('url');
var os = require('os');

var ip = require('./ip');

var PORT = 8080;
var REGISTER = '/register';
var id_counter = 0;

var pods = [];

function Pod(id, ip, sensors) {
    this.id = id;
    this.ip = ip;
    this.sensors = sensors;
}

http.createServer(function(request, response) {
    switch(url.parse(request.url).pathname) {
    case REGISTER:
	if (request.method == "POST") {
	    var body = '';
	    request.on('data', function(data) {
		body += data.toString();
	    });
	    
	    request.on('end', function() {
		var sensors = []
		if (request.headers['content-type'] == 'application/json') {
		    sensors = JSON.parse(body).sensors;
		}
		var pod = new Pod(id_counter++, request.connection.remoteAddress, sensors)
		
		response.writeHead(200, "OK", {'Content-Type': 'text/html'});
		response.write("pod id:" + pod.id);
		response.end();

		pods.push(pod);
		console.log(pods);
	    });
	    
	}
	break;
	
    default:
	break;
    }
}).listen(PORT);

console.log("Master IP: " + ip());
