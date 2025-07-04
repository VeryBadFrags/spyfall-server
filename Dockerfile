# 1. Install pnpm
FROM node:lts-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN corepack enable

# 2. Install & build
FROM base as build
WORKDIR /usr/src/app
RUN pnpm install --prod
COPY . ./
RUN pnpm run build

# 3. Run
FROM base as run
WORKDIR /usr/src/app
USER node
ENV NODE_ENV=production
EXPOSE 8081
COPY .env.prod .
COPY --from=build /usr/src/app/node_modules/ ./node_modules
COPY --from=build /usr/src/app/dist/ ./dist
CMD ["pnpm", "run", "start"]
