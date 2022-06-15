FROM node:18-alpine AS builder


#https://stackoverflow.com/a/61535496/18012991

WORKDIR /app

#COPY . .
#RUN yarn install && ls && pwd && yarn build
#FROM nginx:latest
#COPY ./nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/frontend/build /usr/share/nginx/html

#Run normal pour avoir les variables d'environnement
ENTRYPOINT yarn install; yarn run start
