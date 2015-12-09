'use strict'

var events = require('events');
var util = require('util');
var grove = require('node-grovepi').GrovePi;

var tempSensor  = grove.sensors.TemperatureAnalog;
var lightSensor = grove.sensors.LightAnalog;

var Board = function() {
    this.light = null;
    this.temp = null;
    
    var that = this;
    this.board = new grove.board({
	debug : false,
	onError: function(err) {
	    console.log(err);
	},
	onInit: function(res) {
	    if (res) {
		console.log('GrovePi version: ' + that.board.version());
		that.temp = new tempSensor(2);
		that.light = new lightSensor(1);
	    }
	}
    });
    this.board.init();    
};
util.inherits(Board, events.EventEmitter);

Board.prototype.readLight = function () {
    if (this.light != null) {
	return this.light.read();
    }
};

Board.prototype.readTemp = function () {
    if (this.temp != null) {
	return this.temp.read();
    }
};

module.exports = Board;
