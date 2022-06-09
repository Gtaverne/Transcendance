FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

ENV REACT_APP_BACKEND_ADDRESS $REACT_APP_BACKEND_ADDRESS
ENV REACT_APP_CLIENT_ID $REACT_APP_CLIENT_ID
ENV REACT_APP_STORAGE_PATH $REACT_APP_STORAGE_PATH



RUN yarn install && yarn build

RUN ls

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html