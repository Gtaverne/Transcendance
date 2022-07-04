FROM node:18-alpine AS builder


#https://stackoverflow.com/a/61535496/18012991

WORKDIR /app

COPY . .

#Prod mode
RUN yarn install && yarn build
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html

#Test et debug mode
#Run normal pour avoir les variables d'environnement
#ENTRYPOINT yarn install; yarn run start
