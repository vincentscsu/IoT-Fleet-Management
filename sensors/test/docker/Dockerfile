FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y -q node

ADD ./src /opt/src
WORKDIR /opt/src
EXPOSE 1337
CMD ["node", "receive.js"]