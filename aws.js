/* This program is hosted on AWS and it tells all the masters to
 * grab a new docker image when it's updated and propagate to the
 * agent nodes.
 */

// import required modules
var express = require('express');
var app = express();
var server = require('http').Server(app); // server event emitter
var http = require('http'); // http interface

var exec = require('child_process').exec;
var bodyParser = require('body-parser'); // to parse json
app.use(bodyParser.json()); // mount middleware function at '/' level and execute at every request

// use port 80 for internet access
server.listen(80, function () {
    console.log('listening at *:80');
})

app.post('/api/webhook',function (request, response) {
    // docker hub sends an http post to /api/webhook when new image is available
    contents = request.body;
    var json = contents;
    console.log("Image Name:", json.repository.repo_name);
    child = exec("./pull_distribute.sh "+ json.repository.repo_name, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }

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
    });

    response.send(contents); // echo the result back
});

