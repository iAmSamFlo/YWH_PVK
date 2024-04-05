FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port on which your app runs
EXPOSE 8080

# Command to run the app
CMD ["node", "server.js"]