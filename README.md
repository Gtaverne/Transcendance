<!--
install postgres: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
npm install --save @nestjs/typeorm typeorm pg
//better to set synchronize false if in production in orm.config


GTAVERNE:
todo:
- Les Alertes avec le 2FA


-->
# ft_transcendence

by gtaverne, ttranche and bmerchin

Last project of the 42 Paris curriculum.

It is a fullstack web application.

### Main components :
- Register with oauth 2.0 using the 42 API
- Multiplayer game of pong
- Possibility to create chat rooms
- Simply laungh the project with a single call to a docker compose

### Technology used :
- Frontend in react with typescrypt
- Backend with nestjs, nodejs and postgreSQL

### Launch :
```
yarn dev ou yarn 
```

### .env :
You need to add an API Key from the 42 intranet
When launching with docker-compose, you need a .env file containing the following info:

POSTGRES_PASSWORD=postgres
JWT_Secret=AWonderfulSecret
Client_ID=SEE THE DOCUMENTATION OF 42
Client_Secret=SEE THE DOCUMENTATION OF 42

Enjoy :)

Current deadline : May 12th.
