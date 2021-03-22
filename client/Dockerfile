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

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /srv/app/dist /usr/share/nginx/html