FROM node:18-alpine AS builder

CMD ls

RUN apk update
RUN apk upgrade
RUN apk add bash

#https://stackoverflow.com/a/61535496/18012991

WORKDIR /app/frontend

ENV REACT_APP_BACKEND_ADDRESS $REACT_APP_BACKEND_ADDRESS
ENV REACT_APP_CLIENT_ID $REACT_APP_CLIENT_ID
ENV REACT_APP_STORAGE_PATH $REACT_APP_STORAGE_PATH

#COPY . .
#RUN yarn install && ls && pwd && yarn build
#FROM nginx:latest
#COPY ./nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/frontend/build /usr/share/nginx/html


ENTRYPOINT yarn install; yarn run start
