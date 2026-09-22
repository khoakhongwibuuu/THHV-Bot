FROM node:22-alpine

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

ENV TZ="Asia/Ho_Chi_Minh"

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm config set ignore-scripts false && pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

CMD ["pnpm", "start"]