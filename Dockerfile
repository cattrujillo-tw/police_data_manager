FROM node:8.9.2-alpine

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
ARG REACT_ENV='staging'

COPY . /app/
RUN REACT_APP_ENV=$REACT_ENV REACT_APP_WEB_SOCKET= yarn build

EXPOSE 1234 3000

ENTRYPOINT ["yarn"]
CMD ["start:server"]