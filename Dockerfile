FROM node:10.20.1-jessie

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install

CMD ["node", "server.js"]
