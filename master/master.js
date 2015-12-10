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

var PORT = 80;

var agentIP = [];
var agentStat = [];
var agentCount = 0;

server.listen(PORT, function () {
    console.log('listening at *:' + PORT);
})

function getIP(req) {
    return ( req.headers["X-Forwarded-For"] ||
             req.headers["x-forwarded-for"] || req.client.remoteAddress );
}

var request = require('request');

var requestFunc = function() {
request("http://ec2-54-183-114-126.us-west-1.compute.amazonaws.com/api/poll", function(error, response, body) {
    if (body !== "") {
        console.log(body);
    };
});
};

setInterval(requestFunc, 100);

app.post('/api/ok',function (request, response) {
    var ip = getIP(request);
    var pos = agentIP.indexOf(ip);
    console.log('ip:'+ip);
    console.log('pos:'+pos);
    if (pos > -1){
        agentStat[pos] = 'OK';
        agentCount++;
    }
    if (agentCount == agentIP.length){
        var bodyString = JSON.stringify({
            auth_token : "YOUR_AUTH_TOKEN", 
            title2 : "completed",
            progress : "100"
        }); 
        child = exec(" curl -d '"+bodyString+"' http://localhost:3030/widgets/master", 
                function (error, stdout, stderr) {
        });
    }
});

app.post('/api/register',function (request, response) {
    var ip = getIP(request);
    console.log("ip:", ip);
    if (agentIP.indexOf(ip) == -1){
        agentIP.push(ip);
        var n = agentIP.length;

        var bodyString = JSON.stringify({
            auth_token : "YOUR_AUTH_TOKEN", 
            title2 : "registered",
            progress : "0"
        }); 
        console.log('n:'+n);
        console.log('body:'+bodyString);
        child = exec(" curl -d '"+bodyString+"' http://localhost:3030/widgets/pod"+n, 
                function (error, stdout, stderr) {
        });
    }
    response.send(agentIP);    // echo the result back
    response.end('\n');
});


// process request from aws
app.post('/api/run',function (request, response) {
    contents=request.body;
    var json = contents;
    console.log("Image Name:", json.repo_name);

    agentIP = [];   
    agentStat = [];
    agentCount = 0;

    child = exec("./master.sh "+ json.repo_name, function (error, stdout, stderr) {
        console.log('stdout: \n' + stdout);
        console.log('stderr: \n' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        for (var i = 0; i < agentIP.length; i++)
            if (agentIP[i] != ''){
                var bodyString = JSON.stringify({
                    repo_name : "192.168.1.81:5000/rpi",
                    index : i 
                }); 

                var headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': bodyString.length
                };

                var options = {
                    host: agentIP[i],
                    path: '/api/run',
                    port: 8000,
                    method: 'POST',
                    headers: headers
                };
                http.request(options).write(bodyString);
            }
/*
        var bodyString = JSON.stringify({
            repo_name: "192.168.1.81:5000/rpi"
        }); 

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };

        var options = {
	    // second pi's ip
            host: '192.168.1.82',
            path: '/api/run',
            port: 8000,
            method: 'POST',
            headers: headers
        };
        http.request(options).write(bodyString);
*/ 
        console.log('Image deployed to agents!\n');
    });

    response.send(contents);    // echo the result back
});


//reset dashboard
var bodyString = JSON.stringify({
    auth_token : "YOUR_AUTH_TOKEN", 
    title2 : "ready",
    progress : "0"
}); 

child = exec(" curl -d '"+bodyString+"' http://localhost:3030/widgets/master", 
    function (error, stdout, stderr) {}
);



var bodyString = JSON.stringify({
    auth_token : "YOUR_AUTH_TOKEN", 
    title2 : "unregistered",
    progress : "0"
}); 

child = exec(" curl -d '"+bodyString+"' http://localhost:3030/widgets/pod1", 
    function (error, stdout, stderr) {}
);

var bodyString = JSON.stringify({
    auth_token : "YOUR_AUTH_TOKEN", 
    title2 : "unregistered",
    progress : "0"
}); 

child = exec(" curl -d '"+bodyString+"' http://localhost:3030/widgets/pod2", 
    function (error, stdout, stderr) {}
);

