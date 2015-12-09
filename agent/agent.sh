#!/bin/bash
echo "image : $1"
echo "master : $2"
echo "index : $3"
echo ""
echo "Pulling $1"
echo ""
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"pulling","progress":"5"}' http://$2:3030/widgets/pod$3
docker pull $1
# get the name of the image without repo
IFS="/" read -ra ADDR <<< "$1"
tmp=${ADDR[1]}
# stop old container and remove it
sleep 1
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"stopping","progress":"30"}' http://$2:3030/widgets/pod$3
docker stop $tmp && docker rm $tmp
# start new container with new image
sleep 1
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"starting","progress":"60"}' http://$2:3030/widgets/pod$3
docker run -d -p 8080:8080 --name $tmp $1

sleep 1
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"running","progress":"100"}' http://$2:3030/widgets/pod$3
curl -X POST -d '{}' http://$2:80/api/ok

