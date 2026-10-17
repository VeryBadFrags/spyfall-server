# Node 24 (Krypton LTS)
FROM node:24-alpine
ENV NODE_ENV=production
EXPOSE 8081
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile

# node-owned so compose watch (dev) can sync files in as the node user
COPY --chown=node:node . .
USER node

# Run node directly so it receives SIGTERM from Docker
CMD ["node", "--experimental-transform-types", "src/main.ts"]
