# this image relies on the nodejs image
FROM node:6.11-alpine
# set working directory
WORKDIR /usr/src/feedback-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/feedback-service/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
RUN npm install axios
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .
# string to create tokens (see utils/en-de-coders.js)
ENV TOKEN_SECRET changeme
# header for loggining messages
ENV DEBUG feedback-d
ENV USERS_D_PORT 3091
ENV USER_SERVICE_URL http://user:3090
# name of container running CouchDB
# ENV DB_HOST 192.168.56.102
ENV DB_HOST feedback-db
# database name
ENV DB_NAME feedbacks
# database port default 5984
ENV DB_PORT 5984
# authentication information to CRUD (create/remove/update/delete) objects in our DB
ENV ADMIN_NAME admin
ENV ADMIN_PASSW admin
ENV DB_URL http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# we now use an script to deploy.sh the authentication service
CMD source boot-in-order.sh
