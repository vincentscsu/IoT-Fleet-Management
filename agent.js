var Docker = require('dockerode');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var docker = new Docker();
var container;

var exec = require('child_process').exec;
var qs = require('querystring');
var bodyParser = require('body-parser')
app.use(bodyParser.json())


server.listen(80, function () {
    console.log('listening at *:80');
})
app.post('/api/run',function (request, response) {
    contents=request.body;
    var json = contents;
    console.log(json);

    console.log("Image Name:", json.repo_name);
    child = exec("./accept.sh "+json.repo_name, 
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        }
    );

    response.send(contents);    // echo the result back
});
