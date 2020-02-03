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

You need modify environment variables in tipi-infra/.env for select your
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

Logio is used by applications logs and you can found the url executing the next
command:

```
docker inspect tipi-log | grep IPAddress
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
docker exec -ti tipi-mongo mongorestore -u tipi -p tipi -d tipidb /tmp/tipidb/
```


# Deploy in production environment (IN PROGRESS)

## Construyendo imágenes docker:

cd tipi-engine
docker build -t tipi-engine:master .

cd tipi-backend
docker build -t tipi-backend:master .

cd tipi-frontend
docker build -t tipi-frontend:master .

cd tipi-alerts
docker build -t tipi-alerts:master .
