# Mettre une version fixe
FROM node:18-alpine

RUN apk add --no-cache python3
RUN apk add --no-cache build-base

WORKDIR /app

#Prod mode
COPY . .
RUN yarn install && yarn build
CMD ["node", "dist/src/main.js"]

#Test et debug mode
# ENTRYPOINT yarn install; yarn run start:dev
