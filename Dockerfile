FROM node:16

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build

CMD [ "node", "build/app.api.js" ]