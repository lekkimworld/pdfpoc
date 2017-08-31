FROM node:8.4.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

# export port
EXPOSE 8080

# run
CMD [ "npm", "start" ]
