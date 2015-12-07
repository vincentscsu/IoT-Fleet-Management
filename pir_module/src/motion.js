var gpio = require('rpi-gpio');
var grove = require('node-grovepi').GrovePi;

var temp = grove.sensors.TemperatureAnalog;

var pir_pin = 12;
var light_pin = 1;
var temp_pin = 0;

var pir_reading = null;

var board = new grove.board({
    debug: false,
    onError: function(err) {
	console.log(err)
    },
    onInit: function(res) {
	if (res) {
          console.log('GrovePi Version :: ' + board.version());
	    
            var lightSensor = new grove.sensors.LightAnalog(light_pin);
            console.log('Light Analog Sensor (start watch)');
            lightSensor.on('change', function(res) {
		console.log('Light onChange value=' + res)
            });
            lightSensor.watch();
	}
    }
});
board.init();

gpio.setup(pir_pin, gpio.DIR_IN, readPir);
console.log("PIR sensing app up and running");

function readPir() {
    gpio.read(pir_pin, function(err, value) {
	console.log(err);
	console.log(value);
	reading = value;
    });
}

