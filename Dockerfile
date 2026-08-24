FROM node:18-alpine as build

ARG NG_CONFIGURATION
ARG VERSION

WORKDIR /app

# INSTALL DEPENDENCIES
# the versions in package lock should be tested. force allows installing bad peer dependency despite being tested to be OK
COPY ./web/package.json ./web/package-lock.json ./
RUN npm ci --force

# BUILD
COPY ./web .
ENV VERSION=$VERSION
RUN node ./scripts/set-version.js
RUN npx ng build --configuration="${NG_CONFIGURATION}"


FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /app/dist /usr/share/nginx/html
