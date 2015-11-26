#!/bin/bash
echo ""
echo "image : $1"
#docker kill $(docker ps -q -f "image=$1")
#sleep 1
#docker rmi -f local_registry:5000/$1
#sleep 1
#docker rmi -f $1
#sleep 1
#docker pull  violinbeats/$1
#docker run -p 8080:8080 $1