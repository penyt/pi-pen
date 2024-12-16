FROM arm32v7/node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5472

CMD ["node", "server.js"]
