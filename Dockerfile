FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /src
COPY package*.json ./
RUN npm ci --only=prod --no-optional && npm cache clean --force
COPY . ./
CMD npm start
