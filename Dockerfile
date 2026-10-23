FROM node:24-alpine AS build

ARG NG_CONFIGURATION=production
ARG VERSION

WORKDIR /app

COPY ./web/package.json ./web/package-lock.json ./
RUN npm ci

COPY ./web .
ENV VERSION=$VERSION
RUN node scripts/set-version.mjs && npx ng build --configuration="${NG_CONFIGURATION}" && node scripts/seo-files.mjs "${NG_CONFIGURATION}"


FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /app/dist/browser /usr/share/nginx/html
