'use strict'

var grove = require('./grove');
var gpio = require('rpi-gpio');

var temperature = new grove.Temperature(2);
var light = new grove.Light(1);

var pir_pin = 12;
var pir_reading = null;


gpio.setup(pir_pin, gpio.DIR_IN, readPir);
console.log("PIR sensing app up and running");

function readPir() {
    gpio.read(pir_pin, function(err, value) {
	if (err) {
	    console.log(err);
	} else {
	    console.log(value);
	    pir_reading = value;
	}
    });
}


