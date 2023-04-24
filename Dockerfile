FROM node:19-alpine as build

WORKDIR /cuentas-claras-ui

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /cuentas-claras-ui/build/ /usr/share/nginx/html/

EXPOSE 8080