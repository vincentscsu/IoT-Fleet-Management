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
    console.log("Image Name:", json.repository.repo_name);
    child = exec("./master.sh "+ json.repository.repo_name, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }

        var bodyString = JSON.stringify({
            repo_name: json.repository.repo_name,
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
    });

    response.send(contents);    // echo the result back
});

app.get('/api/run',function(req,res){
    //runExec(container,'/home/webapp/post.sh',res);
    docker.run('baiqizhang/node_base:0.1', 
        ['bash', '-c', '/home/webapp/post.sh'], 
        process.stdout, function (err, data, container) {
          console.log(data.StatusCode);
    });
    res.end("running");
});

function runExec(container,command,res) {
  options = {
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Cmd: [command]
  };
  container.exec(options,function(err, exec) {
    if (err) return;
    exec.start(function(err, stream) {
      if (err) return;
      console.log("run!");
      stream.setEncoding('utf8');
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write('<pre>');
      stream.pipe(res);
    });
  });
}

docker.listContainers({all: false}, function(err, containers) {
  containers.forEach(function (containerInfo) {
    if (containerInfo.Image=='baiqizhang/node_base:0.1'){
        container = docker.getContainer(containerInfo.Id);
    }
    console.log(containerInfo.Image);
  });
});
