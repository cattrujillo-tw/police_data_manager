FROM node:8.11-alpine

RUN apk update && apk add bash

RUN apk add --no-cache fontconfig curl curl-dev && \
  mkdir -p /usr/share && \
  cd /usr/share \
  && curl -L https://github.com/Overbryd/docker-phantomjs-alpine/releases/download/2.11/phantomjs-alpine-x86_64.tar.bz2 | tar xj \
  && ln -s /usr/share/phantomjs/phantomjs /usr/bin/phantomjs \
  && phantomjs --version

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
ARG REACT_ENV
ARG REACT_APP_GOOGLE_API_KEY

COPY . /app/
RUN REACT_APP_ENV=$REACT_ENV REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY yarn build

EXPOSE 1234 3000

CMD ["yarn", "start:server"]