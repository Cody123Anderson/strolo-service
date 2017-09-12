FROM node:8.4.0
MAINTAINER Cody Anderson <cody@serenadedates.com>

RUN mkdir -p /usr/src/serenade-api
COPY . /usr/src/serenade-api
WORKDIR /usr/src/serenade-api

RUN npm install --production

ENV PORT 3000
EXPOSE  $PORT

CMD ["npm", "start"]
