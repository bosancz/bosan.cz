FROM node:24-alpine AS build

ARG NG_CONFIGURATION=production
ARG VERSION

WORKDIR /app

COPY ./web/package.json ./web/package-lock.json ./
RUN npm ci

COPY ./web .
ENV VERSION=$VERSION
RUN node scripts/set-version.mjs && npx ng build --configuration="${NG_CONFIGURATION}" && node scripts/seo-files.mjs "${NG_CONFIGURATION}" && node scripts/og-images.mjs


FROM nginx:alpine

ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/templates /etc/nginx/templates
COPY nginx/cms-auth.js /etc/nginx/njs/cms-auth.js

COPY --from=build /app/dist/browser /usr/share/nginx/html
