FROM resin/rpi-raspbian

RUN apt-get update && \
    apt-get install -y python-dev

ENV PYTHON /usr/bin/python2

RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
    sudo apt-get install -y build-essential python-dev python-rpi.gpio nodejs

ADD src/ /src
WORKDIR /src

RUN npm install rpi-gpio
CMD ["node", "pir.js"]
