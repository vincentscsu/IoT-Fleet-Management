var http = require('http');

var HOST = '10.0.19.2';
var REGISTER = '/register';
var PORT = 8080;

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

//This is the data we are posting, it needs to be a string or a buffer
req.write("hello world!");
req.end();
