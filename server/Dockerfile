FROM node:14

WORKDIR /srv/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . . 
# RUN npm run build

EXPOSE 3000

CMD ["npm","start"]
