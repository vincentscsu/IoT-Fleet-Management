var gpio = require('rpi-gpio');

var pir_pin = 12;
var prev = null;
gpio.setup(pir_pin, gpio.DIR_IN, readPir);

console.log('Pi deployed successfully');

function readPir() {
	gpio.read(pir_pin, function(err, value) {
		if (value && prev != value) {
			console.log("Motion detected");
		} else if (!value && prev != value) {
			console.log("Sensing for motion...");
		}
		prev = value;
	});
}
setInterval(readPir, 500);
