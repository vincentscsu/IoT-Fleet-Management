var Docker = require('dockerode');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var docker = new Docker();
var container;

var exec = require('child_process').exec;
var bodyParser = require('body-parser')
app.use(bodyParser.json())

var MASTER_IP = '192.168.1.81';
var PORT = 8000;

server.listen(PORT, function () {
    console.log('listening at *:' + PORT);
})
app.post('/api/run',function (request, response) {
    contents=request.body;
    var json = contents;
    var index = json.index + 1;

    console.log("Image Name:", json.repo_name);
    child = exec("./agent.sh "+json.repo_name + ' ' + MASTER_IP + ' ' + index, 
        function (error, stdout, stderr) {
            console.log('stdout: \n' + stdout);
            console.log('stderr: \n' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        }
    );

    response.send(contents);    // echo the result back
});
