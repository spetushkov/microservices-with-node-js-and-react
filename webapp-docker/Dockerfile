# Base image
FROM node:alpine

# Working directory
WORKDIR /usr/webapp-docker

# Download and install dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Start
CMD ["npm", "start"]