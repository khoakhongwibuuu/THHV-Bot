FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
ENV TZ="Asia/Ho_Chi_Minh"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./
COPY . .

RUN yarn 
# If you are building your code for production
# RUN npm --omit=dev

# Bundle app source

CMD [ "yarn", "start" ]