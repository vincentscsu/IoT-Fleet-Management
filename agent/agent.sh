#!/bin/bash
echo ""
echo "Pulling $1"
echo ""
docker pull $1
# get the name of the image without repo
IFS="/" read -ra ADDR <<< "$1"
tmp=${ADDR[1]}
# stop old container and remove it
docker stop $tmp && docker rm $tmp
# start new container with new image
docker run -d -p 8080:8080 --name $tmp $1
