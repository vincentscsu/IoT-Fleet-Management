var gpio = require('rpi-gpio');
var express = require('express');

var pir_pin = 12;
var reading = null;

var PORT = 8080;
var app = express();

gpio.setup(pir_pin, gpio.DIR_IN, readPir);
console.log("PIR sensing app up and running");
function readPir() {
	gpio.read(pir_pin, function(err, value) {
		console.log(err);
		console.log(value);
		reading = value;
	});
}

app.get('/', function(req, res) {
	readPir();
	res.send('<html><body>Motion Detected: ' + reading + '</body></html>');
});

app.listen(PORT);
console.log("PIR sensing app listening on " + PORT);

