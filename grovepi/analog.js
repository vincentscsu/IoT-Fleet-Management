var GrovePi = require('node-grovepi').GrovePi;

var Commands = GrovePi.commands
var Board = GrovePi.board

var temp  = GrovePi.sensors.TemperatureAnalog;
var LightAnalogSensor = GrovePi.sensors.LightAnalog;

var board = new Board({
    debug: false,
    onError: function(err) {
      console.log(err)
    },
    onInit: function(res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version());

        var lightSensor = new LightAnalogSensor(1);
        console.log('Light Analog Sensor (start watch)');
        lightSensor.on('change', function(res) {
          console.log('Light onChange value=' + res)
        });
        lightSensor.watch();
      }
    }
  });


board.init();
