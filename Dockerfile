FROM node:24.16.0-alpine3.23

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
ENV TZ="Asia/Ho_Chi_Minh"

COPY ./package*.json ./yarn.lock* ./
COPY . .

RUN yarn install --frozen-lockfile || yarn install

CMD [ "yarn", "start" ]
