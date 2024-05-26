# 1. Install & build
FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production --no-optional
COPY . ./
RUN npm run build

# 2. Run
FROM node:lts-alpine as run
WORKDIR /usr/src/app
USER node
ENV NODE_ENV=production
EXPOSE 8081
COPY .env.prod .
COPY package*.json ./
COPY --from=build /usr/src/app/node_modules/ ./node_modules
COPY --from=build /usr/src/app/dist/ ./dist
CMD ["npm", "run", "start"]
