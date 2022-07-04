# Mettre une version fixe
FROM node:18-alpine

RUN apk add --no-cache python3
RUN apk add --no-cache build-base

WORKDIR /app

#COPY . .

#RUN yarn install && yarn build

#CMD ["node", "dist/src/main.js"]
# ENTRYPOINT yarn install; yarn run start:dev
ENTRYPOINT yarn install; yarn run start:prod
