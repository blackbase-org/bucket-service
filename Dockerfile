# Etape de build
FROM node:20-alpine AS builder
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3003
CMD ["node", "dist/main"]
