FROM node:10

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . . 
# RUN npm run build

CMD ["npm","start"]