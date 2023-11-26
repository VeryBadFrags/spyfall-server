# 🕵️ Spyfall - Server

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

A multiplayer social deduction game inspired by [Spyfall](https://hwint.ru/portfolio-item/spyfall/).

[♟️ Play the game](https://spy.verybadfrags.com)

![Example of a game](docs/spyfall-example-01.png)

---

🛠️ Built with [Node](https://nodejs.org/en), [Typescript](https://www.typescriptlang.org), and [socket.io](https://socket.io).
Hosted on [Netlify](https://www.netlify.com) & [Render](https://render.com).

💾 View the client source code [here](https://github.com/VeryBadFrags/spyfall-client).

## Run locally

### With [pnpm](https://pnpm.io)

```sh
make dev
```

Run `make` to view all available commands.

### With [npm](https://www.npmjs.com)

```sh
npm i
npm run dev
```

## Server setup

You can run a custom server with either [pm2](https://pm2.keymetrics.io) or Docker. See [server_setup.md](docs/server_setup.md)
