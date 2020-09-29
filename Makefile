show_local_mongo:
	brew services list

stop_local_mongo:
	brew services stop mongodb-community

start_docker_mongo:
	docker-compose -f docker-compose-mongo.yml up -d

stop_docker_mongo:
	docker stop bus_booking_mongo_1

install:
	npm install

run_test:
	npm test

run:
	npm start

package:
	echo "to create a docker build/ python package/code artefacts"
	docker-compose -f ./docker-compose.yml build

run_package:
	docker-compose -f docker-compose.yml up

publish:
	echo "to publish a created docker image / code artefacts to a cental repository"
	docker-compose -f ./docker-compose.yml push

deploy:
	echo "deploying"
