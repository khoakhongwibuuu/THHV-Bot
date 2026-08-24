FROM node:22-alpine

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

ENV TZ="Asia/Ho_Chi_Minh"

COPY ./package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]