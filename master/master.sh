#!/bin/bash
echo ""
echo "Pulling $1..."
echo ""
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"pulling","progress":"5"}' http://localhost:3030/widgets/master
docker pull $1
echo ""
echo "Pushing $1 to local registry..."

sleep 1
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"registering","progress":"30"}' http://localhost:3030/widgets/master

# get the name of the image without the repo
IFS="/" read -ra ADDR <<< "$1"
tmp=${ADDR[1]}
echo tmp
# stop and remove old container
docker stop $tmp && docker rm $tmp
# remove old image and push the new one to local registry
docker rmi -f localhost:5000/$tmp
docker tag $1 localhost:5000/$tmp
docker push localhost:5000/$tmp
echo ""
echo "Image pushed to local registry."
echo ""
echo "Restarting local container..."
docker run -d -p 8080:8080 --net host --name $tmp localhost:5000/$tmp

sleep 1
curl -d '{"auth_token":"YOUR_AUTH_TOKEN","title2":"distributing","progress":"50"}' http://localhost:3030/widgets/master

