FROM resin/rpi-raspbian

RUN echo spi-dev >> /etc/modules
RUN echo i2c-dev >> /etc/modules
RUN echo i2c-bcm2708 >> /etc/modules
RUN echo dtparam=i2c1=on >> /boot/config.txt
RUN echo dtparam=i2c_arm=on >> /boot/config.txt

RUN sudo apt-get update && apt-get install -y \
	python-pip \
	python-smbus \
	libi2c-dev \
	python-serial \
	i2c-tools \
	minicom \
	python-dev \
	git
RUN sudo pip install -U RPi.GPIO

RUN git clone git://git.drogon.net/wiringPi
RUN cd wiringPi && ./build
