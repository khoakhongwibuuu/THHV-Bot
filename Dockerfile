FROM node:26.6.0

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

ENV TZ="Asia/Ho_Chi_Minh"

COPY ./package*.json ./yarn.lock* ./

COPY . .

RUN yarn install --frozen-lockfile || yarn install

CMD [ "yarn", "start" ]
