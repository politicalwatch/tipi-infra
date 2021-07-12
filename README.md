# Deploy on develop environment

## Clone repositories

* tipi-engine:

```
git clone https://github.com/politicalwatch/tipi-engine.git
```

* tipi-backend:

```
git clone https://github.com/politicalwatch/tipi-backend.git
```

* tipi-tasks:

```
git clone https://github.com/politicalwatch/tipi-tasks.git
```

* tipi-frontend:

```
git clone https://github.com/politicalwatch/tipi-frontend.git
```

or

```
git clone https://github.com/politicalwatch/parlamento2030.es.git
```

* tipi-infra:

```
git clone https://github.com/politicalwatch/tipi-infra.git
```

## Edit environment vars

* copy tipi-infra/.env.dev to tipi-infra/.env.
* modify environment variables in tipi-infra/.env to select your
project paths and prefered ports.

You can also modify specific environment variables on each project. It exists a .env file inside them.

When you finish configuring them, it is time to exec the complete project:

```
# Build images and up containers with projects
docker-compose build
docker-compose up -d
```

Your project are now running by default at:

- Port 5000: Backend App
- Port 8080: Frontend App
- Port 8090: Mongo Express (to manage database)


## Checking logs

here are two ways to check logs:

1. Logio is used by applications logs and you can found the url executing the following command:

```
docker inspect tipi-log | grep IPAddress
```

2. Check log for each container separately:

```
docker logs -f CONTAINER_NAME
```

## Loading backup data

```
# Copy dump_db folder on tipi-mongo container
docker cp tipidb tipi-mongo:/tmp
# Restore database: tipi is the user and pass by default and tipidb the db name
docker exec -ti tipi-mongo mongoimport -u tipi -p tipi -d tipidb -c topics /tmp/tipidb/topics.json
```

Note that inside tipi-infra there is an example data for testing (you can load it if you wish).

## Refresh knowledge base

When you want to refresh the knowledge base after the modifications of the tags (and their regexs), you have to follow these steps:

* Export knowledge base to JSON format. You can use our [tipi-extract-topics](https://github.com/politicalwatch/tipi-extract-topics#readme) module.
* Copy topics.json file to tipi-mongo container
* Refresh Mongo collection with the new knowledge base

```
docker cp topics.json tipi-mongo:/tmp
# Change username and password in production
docker exec -ti tipi-mongo mongoimport -u tipi -p tipi -d tipidb -c topics --drop /tmp/topics.json
```


If you want to re-tag all parliamentary activity with the updated knowledge base, you have to access to MongoDB and then execute:

```
db.initiatives.updateMany({}, {$set: {tagged: false, topics: [], tags: []}})
```

After that, execute (outside MongodDB)

```
docker exec -ti tipi-engine python quickex.py tagger
```

Note: Remember do not execute these commands on production environment. You have to execute them on develop environment and then export the database and import it on production MongoDB instance.


# Deploy on production environment

## Building docker images:

Currently, images are built automatically when there is a new commit on the repository master branch, but you can also build the image manually.

For example, these are the steps for creating and uploading one backend image:

1. Move to repository folder and build the docker image

```
cd tipi-backend
docker build -t politicalwatch/tipi-backend:latest .
```

IMPORTANTE NOTICE: you should change .env.production in case of you are building tipi-frontend module.

2. Login to dockerhub

```
docker login docker.io --username=xxx --password=xxx
```

3. Push image to dockerhub

```
docker push politicalwatch/tipi-backend:latest
```

## Configure tipi-infra

1. Copy the reposository tipi-infra in the server
2. Copy the next files:

```
cp mongo-init.js.example mongo-init.js
cp .env.pro .env
cp .env.mongo.example .env.mongo
cp .env.tasks.example .env.tasks
cp .env.backend.example .env.backend
cp .env.engine.example .env.engine
cp .env.frontend.example .env.frontend
```

3. Modify variables on them. Pay attention to mongo-init.js file, because this file will create the database and its user. You should put the same values as .env file.

4. Execute the project:

Firstly, we need to download the images:

```
docker-compose -f docker-compose-pro.yml pull
```

NOTE: for whatever command that you want to use with docker-compose, you have to indicate into the configuration file.

IMPORTANT NOTICE: If you have a proxy, you need to add the command for gunicorn in docker-compose-pro.yml, inside tipi-backend:

```
    command: gunicorn --proxy-allow-from "xx.xx.xx.xx" --access-logfile - tipi_backend.wsgi:app
```

Finally, up the environment:

```
docker-compose -f docker-compose-pro.yml up -d
docker-compose -f docker-compose-pro.yml down
```

5. Update images:

```
docker-compose -f docker-compose-pro.yml pull

or

docker-compose -f docker-compose-pro.yml pull image-name
```

and then restart (up/down) containers.


6. Clean temp images and volumes

```
docker rmi $(docker images -f dangling=true -q)
docker volume prune
```

7. Using New Relic (performance monitoring tool)

If you want to use New Relic, follow these steps:

Add this line to into docker-compose-pro.yml (section tipi-backend)

```
volumes:
  - ./newrelic.ini:/app/newrelic.ini
```

Copy your New Relic's config file (newrelic.ini into this project (root directory)

Copy this line into your .env.backend

```
NEW_RELIC_CONFIG_FILE=/app/newrelic.ini
```

Ensure it always executes

```
newrelic-admin run-program [command]
```

before any other command.
