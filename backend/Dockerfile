FROM node:21

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
