FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install && yarn build

RUN ls

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /usr/share/nginx/html