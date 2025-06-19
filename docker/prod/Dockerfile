FROM node:18-alpine as builder


WORKDIR /app

COPY package*.json ./

RUN npm ci

# ci will make sure that only those depencies will get installed whoes version and names are mentioned in the package-lock.json

COPY . .

RUN npm run build






FROM node:18-alpine as production


ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts --omit=dev

COPY --from=builder /app/dist ./

EXPOSE 5500

CMD ["node", "src/server.js"]