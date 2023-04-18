FROM node:18-alpine as build

ARG NG_CONFIGURATION

WORKDIR /app

# INSTALL DEPENDENCIES
COPY ./web/package.json ./web/package-lock.json ./
RUN npm ci

# BUILD
COPY ./web .
RUN npx ng build --configuration="${NG_CONFIGURATION}"


FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /app/dist /usr/share/nginx/html