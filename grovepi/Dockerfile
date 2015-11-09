FROM resin/rpi-raspbian

RUN sudo apt-get update 
RUN sudo apt-get upgrade 
RUN sudo apt-get -y install python-dev 
RUN sudo apt-get -y install python-pip 
RUN sudo apt-get -y install wget
RUN sudo pip install RPi.GPIO 
RUN sudo pip install paho-mqtt 

RUN sudo apt-get -y install git 
RUN git clone https://github.com/DexterInd/GrovePi 
RUN sudo chmod +x GrovePi/Script/install.sh 
RUN echo -ne '\n' | sudo GrovePi/Script/install.sh

CMD ["python", "pot.py"]
