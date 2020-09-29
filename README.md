# Bus Ticket Booking Service
Refer to Makefile for all make targets

## How to run locally
1. Install Docker
2. Install nodejs
3. Run mongodb locally using docker
`make start_docker_mongo`
(Calls `docker-compose -f docker-compose-mongo.yml up -d`)
If you are not going to use some other mongo, change value of mongo connection string in config/dev.json file)
4. Install nodejs dependencies
`make install`
(Calls `npm install`)
5. Run tests
`make run_test`
(Calls `npm test`)
6. Run Service
`make run`
(Calls `npm start`)
7. Create a Package/Artifact so that this service can be deployed anywhere
`make package`
(Calls `docker-compose -f ./docker-compose.yml build`)
8. Test your Package/Artifact
`make run_package`
(Calls `docker-compose -f docker-compose.yml up`)
Test by hitting APIs via POSTMAN.
9. Publish this Package/Artifact so that it can be downloaded anywhere
`make publish`
(Calls `docker-compose -f ./docker-compose.yml push`)
(You might have to do make sure you have done docker login and the image name contains the docker repo path)

## How to run on a server
1. Install Docker
2. Run mongodb locally using docker
`make start_docker_mongo`
(Calls `docker-compose -f docker-compose-mongo.yml up -d`)
If you are not going to use some other mongo, change value of mongo connection string in config/dev.json file & rebuild)
3. Run your Package/Artifact
`make run_package`
(Calls `docker-compose -f docker-compose.yml up`)
(You might have to do make sure you have done docker login and the image name contains the docker repo path)
Test by hitting APIs via POSTMAN.
