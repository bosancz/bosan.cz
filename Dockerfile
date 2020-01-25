FROM node:lts

WORKDIR /home/node/app

RUN chown node .

COPY --chown=node . .

USER node

RUN npm install 

RUN npm run build

CMD ["npm", "start"]