'use strict'

var events = require('events');
var util = require('util');
var grove = require('node-grovepi').GrovePi;

var light = grove.sensors.LightAnalog;

var Light = function(pin) {
    this.sensor = null;
    this._value = this.readValue();
    var that = this;
    this.board = new grove.board({
	debug : false,
	onError: function(err) {
	    console.log(err);
	},
	onInit: function(res) {
	    if (res) {
		console.log('GrovePi Light version: ' + that.board.version());
		that.sensor = new light(pin);
	    }
	}
    });
    this.board.init();
    
    function checkChange() {
	var newValue = this.readValue();
	if (Math.abs(newValue - this._value) > 1) {
	    this._value = newValue;
	    this.emit('change', newValue);
	}
    }
    
};

util.inherits(Light, events.EventEmitter);
Light.prototype.readValue = function () {
    if (this.sensor != null) {
	return this.sensor.read();
    }
};

module.exports = Light;
