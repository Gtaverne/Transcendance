# ft_transcendence

This is the last project of the 42 Paris curriculum.

It is a fullstack web application.

We validated the project with 100% and full outstanding.

## Launch :
```
docker-compose up --build
```

## Main components :
- Multiplayer game of pong
- Create different types of chat rooms with permissions
- Register with oauth 2.0 using the 42 API
- Simply launch the project with a single call to a docker compose
## Technology used :
- Frontend in React with typescrypt
- Backend with nestjs
- Database with postgreSQL
- Communication between clients in the Game ant chat with socket.io

## .env :
You need the following 3 .env files:

You need to get the cliend id and the client secret from the 42 intranet.

In the project folder:
```
POSTGRES_PASSWORD=postgres
JWT_SECRET=AWonderfulSecret
CLIENT_ID= <----- FROM THE 42 INTRA
CLIENT_SECRET= <----- FROM THE 42 INTRA
```
In the frontend folder:
```
REACT_APP_CLIENT_ID= <----- FROM THE 42 INTRA
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_API_PATH=/api/
REACT_APP_STORAGE_PATH=/api/microcdn/
```
In the backend folder:
```
#Database
POSTGRES_HOST='127.0.0.1'
POSTGRES_PORT=5432
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='postgres'
POSTGRES_DATABASE='transcendance_db'

#API 42
INTRA_API= "https://api.intra.42.fr/oauth/token"
Auth_URL= "https://api.intra.42.fr/oauth/authorize"
Access_Token_URL= "https://api.intra.42.fr/oauth/token"
Client_ID= "..." <----- FROM THE 42 INTRA
Client_Secret= "..." <----- FROM THE 42 INTRA

JWT_Secret='DuduleToken'
FRONT_DOMAIN='http://localhost:3000'
```

Enjoy :)

## Authors

- [@gtaverne](https://www.github.com/Gtaverne)
- [@ttranche](https://www.github.com/ttranche)
- [@benjaminmerchin](https://www.github.com/benjaminmerchin)
