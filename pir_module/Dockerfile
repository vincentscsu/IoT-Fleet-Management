FROM resin/rpi-raspbian
RUN apt-get update && \
    apt-get install -y  python-dev
RUN apt-get install -y build-essential
ENV PYTHON /usr/bin/python2

# install nodejs for rpi
RUN apt-get install -y wget && \
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb && \
    dpkg -i node_latest_armhf.deb && \
    rm node_latest_armhf.deb && \
    apt-get autoremove -y wget

# install RPI.GPIO python libs
RUN apt-get install -y wget && \
     wget http://downloads.sourceforge.net/project/raspberry-gpio-python/raspbian-wheezy/python-rpi.gpio_0.5.11-1_armhf.deb && \
     dpkg -i python-rpi.gpio_0.5.11-1_armhf.deb && \
     rm python-rpi.gpio_0.5.11-1_armhf.deb && \
     apt-get autoremove -y wget

ADD src/ /src
WORKDIR /src
RUN npm install

EXPOSE  8080
CMD ["node", "pir.js"]

