# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


docker file code
--------------------
# Use the official Node.js image as our base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app's source code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5501

# The command to run our app
CMD ["npm", "run", "dev"]



Building the Docker Image
docker build -t auth-service:dev -f docker/dev/Dockerfile .




docker run --rm -it -v ${pwd}:/usr/src/app -v /usr/src/app/node_modules --env-file ${pwd}/.env.dev -p 5501:5501 -e NODE_ENV=development auth-service:dev
ℹ️ For Powershell users:
use `${PWD}` instead of `$(pwd)`

ℹ️ For Command prompt (cmd) users:
use `%cd%` instead of `$(pwd)`

Your Express app is now accessible at `http://localhost:5501`.







// If container is running in interactive mode.
ctr + c

// If container is running in detached mode.
// List all running container
docker ps

// Stop the container using container id
docker stop <container id>




Pull the PostgreSQL Docker image 🖼️:
--------------------------------------
docker pull postgres



Create a Persistent Volume 💾:
------------------------------


Pull the PostgreSQL Docker image 🖼️:
========================================
docker pull postgres

​
Create a Persistent Volume 💾:
===================================
Persistent volumes ensure that the data remains intact even if the container stops or crashes.
===================================================================================================
docker volume create mernpgdata

​
Run the PostgreSQL container with the volume attached 🏃‍♂️:
------------------------------------------------------------
docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres

