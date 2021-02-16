FROM node:lts-alpine as base
RUN apk add --update make rsync
WORKDIR /home/node
# Install npm dependencies
COPY package*.json ./
RUN npm ci
# Build client
COPY . ./
RUN npm run build

# Production Image
FROM node:lts-alpine as prod
WORKDIR /home/node
ENV NODE_ENV=production
USER node
COPY --from=base /home/node/build/ build/
COPY package*.json ./
COPY server/ server/
# Install prod dependencies dependencies
RUN npm ci --only=prod --no-optional
EXPOSE 8081
CMD ["node", "server"]
