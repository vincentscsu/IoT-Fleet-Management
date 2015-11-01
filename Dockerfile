FROM nodesource/node:jessie

ADD package.json package.json
RUN npm install
ADD . .

CMD npm start && npm test
