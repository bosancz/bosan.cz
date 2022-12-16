# builder must be same platform as server so that packages (e.g. sharp) build for the same platform where used
# dividing builder and server saves around 30MB (npm install cache?)
FROM node:14.16-alpine as builder

WORKDIR /srv/app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY ./src ./src
COPY ./assets ./assets



FROM node:14.16-alpine as server

WORKDIR /srv/app

COPY --from=builder /srv/app /srv/app

EXPOSE 3000

CMD ["npm","start"]
