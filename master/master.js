/* This program runs on each master node and it pulls the updated image from docker hub,
 * store it to local registry, restart container, and tell the local agents to grab the 
 * updated image and restart their containers.
 */

// import required modules
var Docker = require('dockerode');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var http = require('http');

var docker = new Docker();
var container;

var exec = require('child_process').exec;
var bodyParser = require('body-parser')
app.use(bodyParser.json())

server.listen(80, function () {
    console.log('listening at *:80');
})

// process request from aws
app.post('/api/run',function (request, response) {
    contents=request.body;
    var json = contents;
    console.log("Image Name:", json.repo_name);
    child = exec("./master.sh "+ json.repo_name, function (error, stdout, stderr) {
        console.log('stdout: \n' + stdout);
        console.log('stderr: \n' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }

        var bodyString = JSON.stringify({
            repo_name: "192.168.1.81:5000/rpi"
        }); 

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };

        var options = {
            host: '192.168.1.69',
            path: '/api/run',
            port: 80,
            method: 'POST',
            headers: headers
        };
        http.request(options).write(bodyString);
        console.log('Image deployed to agents!\n');
    });

    response.send(contents);    // echo the result back
});

