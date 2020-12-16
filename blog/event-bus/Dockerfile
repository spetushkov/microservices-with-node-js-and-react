# Base image
FROM node:alpine

# Working directory
WORKDIR /usr/blog-event-bus

# Download and install dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Start
CMD ["npm", "start"]