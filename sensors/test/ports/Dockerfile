FROM    centos:centos6

RUN     yum install -y epel-release
RUN     yum install -y nodejs npm

COPY /src /src
RUN cd /src; npm install

EXPOSE 8080
EXPOSE 1337
CMD ["node", "/src/index.js"]