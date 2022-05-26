<!--
install postgres: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
npm install --save @nestjs/typeorm typeorm pg
//better to set synchronize false if in production in orm.config


GTAVERNE:
todo:
- Check double username
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
docker-compose up --build
```

### .env :
You need to add an API Key from the 42 intranet

Enjoy :)

Current deadline : May 12th.
