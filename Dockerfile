FROM node:6
MAINTAINER Cody Anderson <cody@serenadedates.com>

RUN mkdir -p /usr/serenade-api
COPY . /usr/serenade-api
WORKDIR /usr/serenade-api
RUN npm install --production

ENV PORT 3000
EXPOSE  $PORT

CMD ["npm", "start"]
