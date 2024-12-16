FROM arm64v8/node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache \
    libc6-compat \
    && apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
    raspberrypi-utils-vcgencmd

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5472

CMD ["node", "server.js"]
