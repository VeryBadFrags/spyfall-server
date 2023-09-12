FROM node:lts-alpine
WORKDIR /home/node
USER node
ENV NODE_ENV=production
EXPOSE 8081

COPY package*.json ./
# Install prod dependencies
RUN npm ci --only=prod --no-optional

COPY . ./
CMD ["npm", "run", "start"]
