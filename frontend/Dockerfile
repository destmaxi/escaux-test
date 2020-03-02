# this image relies on the nodejs image
FROM node:12.2.0
# set working directory
WORKDIR /usr/src/frontend-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
# RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/frontend-service/node_modules/.bin:${PATH}
ADD . .
RUN npm install
EXPOSE 80
# source files of the authentication service

CMD npm start
