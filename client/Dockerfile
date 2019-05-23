FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/custom_404.html /usr/share/nginx/html/custom_404.html
COPY --from=build-stage /app/dist /usr/share/nginx/html

