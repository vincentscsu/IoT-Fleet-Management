FROM hypriot/rpi-node
RUN apt-get update && \
    apt-get install -y build-essential \
		       libc6-dev \			
		       gcc \
		       curl \
		       python-pip \
		       wget

RUN wget http://node-arm.herokuapp.com/node_latest_armhf.deb
RUN sudo dpkg -i node_latest_armhf.deb

ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 8080

COPY src /src

CMD ["node", "/src/app.js"]
