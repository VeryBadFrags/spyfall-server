# 1. Install node_modules
FROM node:lts-alpine as install
WORKDIR /usr/src/app
COPY package*.json ./
# Install prod dependencies only
RUN npm ci --production --no-optional

# 2. Build into dist/
FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY . ./
COPY --from=install /usr/src/app/node_modules/ ./node_modules
RUN npm run build

# 3. Run
FROM node:lts-alpine as run
WORKDIR /usr/src/app
USER node
ENV NODE_ENV=production
EXPOSE 8081
COPY .env.prod .
COPY package*.json ./
COPY --from=install /usr/src/app/node_modules/ ./node_modules
COPY --from=build /usr/src/app/dist/ ./dist
RUN ls -lah
CMD ["npm", "run", "start"]
