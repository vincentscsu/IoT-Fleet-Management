var http = require('http');

var HOST = '10.0.19.2';
var REGISTER = '/register';
var PORT = 8080;
var sensors = ['pump', 'microphone'];
    
var options = {
    host: HOST,
    path: REGISTER,
    port: PORT,
    method: 'POST',
    headers: {'Content-Type' : 'application/json'}
};

var req = http.request(options, function(response) {
    var str = ''
    response.on('data', function (chunk) {
	str += chunk;
    });
    
    response.on('end', function () {
	console.log(str);
    });
    
});

req.write(JSON.stringify({'sensors':sensors}));
req.end();
