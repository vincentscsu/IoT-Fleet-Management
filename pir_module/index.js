var gpio = require('rpi-gpio');
var pir_pin = 12;
gpio.setup(pir_pin, gpio.DIR_IN, readPir);

console.log('Pi deployed successfully');

function readPir() {
	gpio.read(pir_pin, function(err, value) {
		if (value) {
			console.log("Motion detected");
		}
	});
}
setInterval(readPir, 500);
