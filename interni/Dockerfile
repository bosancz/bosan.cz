FROM node:14.16 as build

ARG NG_CONFIGURATION

WORKDIR /srv/app

# INSTALL DEPENDENCIES
COPY package.json package-lock.json ./
RUN npm ci

# COMPILE ESM MODULES
RUN ./node_modules/.bin/ngcc --properties es2015

# BUILD
COPY . .
RUN npx ng build --configuration="${NG_CONFIGURATION}"



FROM nginx:1.19-alpine

WORKDIR /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*

COPY nginx-server.conf /etc/nginx/conf.d/

COPY --from=build /srv/app/dist ./