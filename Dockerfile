FROM node:22-bookworm

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "app/app.js"]

EXPOSE 3000
