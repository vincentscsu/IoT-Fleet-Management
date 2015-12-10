/* This program is hosted on AWS and it tells all the masters to
 * grab a new docker image when it's updated and propagate to the
 * agent nodes.
 */

// import required modules
var express = require('express');
var app = express();
var server = require('http').Server(app); // server event emitter
var http = require('http'); // http interface
var REPONAME = "";

var fs = require('fs');
var bodyParser = require('body-parser'); // to parse json
app.use(bodyParser.json()); // mount middleware function at '/' level and execute at every request

var PORT = 80;

// use port 80 for internet access
server.listen(PORT, function () {
    console.log('listening at *:' + PORT);
})

app.post('/api/webhook',function (request, response) {
    // docker hub sends an http post to /api/webhook when new image is available
    contents = request.body;
    var json = contents;
    console.log("Image Name:", json.repository.repo_name);
    
    REPORNAME = json.repository.repo_name;

/*
    // stringigy adds quotes to the keys
    var bodyString = JSON.stringify({           
            repo_name: json.repository.repo_name,
        });

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };

        var options = {
            // currently directs to vincent's rpi master
            host: '107.203.254.104',
	        path: '/api/run',
            port: 80,
            method: 'POST',
            headers: headers
        };
	
	// send request to masters
        http.request(options).write(bodyString);
        console.log('Image deployed to masters!\n');
*/
    response.send(contents); // echo the result back
});

app.get('/api/poll', function (request, response) {
    response.end(REPONAME);
    if (REPONAME !== "") {
        REPONAME = "";
    };
});

