# Deploy in develop environment

## Clone repositories

* tipi-engine:

```
git clone https://github.com/politicalwatch/tipi-engine.git
```

* tipi-backend:

```
git clone https://github.com/politicalwatch/tipi-backend.git
```

* tipi-alerts:

```
git clone https://github.com/politicalwatch/tipi-alerts.git
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

You need to:

- copy tipi-infra/.env.dev to tipi-infra/.env.
- modify environment variables in tipi-infra/.env for select your
project paths and your prefered ports.

You can modify specific environment variables of each project. Exists a .env
file inside of each project.

When you finish, you can exec the complete project:

```
# Build images and up containers with projects
docker-compose up -d
```

Your project are running by default at:

- Port 8090: Mongo Express
- Port 5000: Backend
- Port 5001: Frontend


## Check logs about your services

There is tow ways to check logs:

1. Logio is used by applications logs and you can found the url executing the next
command:

```
docker inspect tipi-log | grep IPAddress
```

2. Check each container with docker logs command:

```
docker logs -f CONTAINER_NAME
```

## Exec tipi-engine

### Cron

You can modify the cron task for tipi-engine in tipi-infra/engine-cron

You need to activate crontab task:

```
docker exec -ti tipi-engine crontab /etc/cron.d/engine-cron
```

### One time

```
docker exec -ti tipi-engine python base.py
```

## Load data in mongodb

Inside tipi-infra there is an example data for work, you can load it if you want

```
# Copy tipidb folder with data in tipi-mongo docker
docker cp tipidb tipi-mongo:/tmp
# Restore data in DB: tipi is the user and pass by default and tipidb the db name
docker exec -ti tipi-mongo mongoimport -u tipi -p tipi -d tipidb -c topics /tmp/tipidb/topics.json
```


# Deploy in production environment (IN PROGRESS)

## Building docker images:

NOTE: Examples are put using the master branch, but you can change if you have an
staging server.

cd tipi-engine
docker build -t tipi-engine:master .

cd tipi-backend
docker build -t tipi-backend:master .

cd tipi-frontend
docker build -t tipi-frontend:master .

cd tipi-alerts
docker build -t tipi-alerts:master .

When you had generated all images, you should upload to dockerhub:

- docker push tipi-engine:master

## Configure tipi-infra

1. Copy the reposository tipi-infra in the server
2. Copy the next files:

```
cp mongo-init.js.example mongo-init.js
cp .env.pro .env
cp .env.mongo.example .env.mongo
cp .env.alerts.example .env.alerts
cp .env.backend.example .env.backend
cp .env.engine.example .env.engine
cp .env.frontend.example .env.frontend
```

3. Modify in these files variables that you need its. Very important the
   mongo-init.js file, because this file create the database and user, and you
   should put the same value in this file and .env file

4. Execute the project:

```
docker-compose -f docker-compose-pro.yml up -d
```

NOTE: for whatever command that you want to use with docker-compose, you need to
pass the file, for example:

```
docker-compose -f docker-compose-pro.yml down
docker-compose -f docker-compose-pro.yml logs -f
```
