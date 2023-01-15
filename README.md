# Spyfall - Server

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/VeryBadFrags/online-spy-server/blob/master/LICENSE)

A multiplayer social deduction game inspired by [Spyfall](https://hwint.ru/portfolio-item/spyfall/).

Built with Node and [socket.io](https://socket.io). Hosted on [Netlify](https://www.netlify.com) & [Render](https://render.com).

View the client code [here](https://github.com/VeryBadFrags/online-spy-client).

[▶️ Play the game](https://spy.verybadfrags.com)

## Run with Node

Install the Node nodules and start the server

```sh
npm i
npm start
```

## Develop locally

```sh
npm i
npm run dev
```

## Docker

Run locally

```sh
docker-compose up --build
```

Push image to Docker Hub

```sh
docker-compose build
docker image tag online-spy_web verybadfrags/online-spy
docker push verybadfrags/online-spy
```

## Server setup

- Custom server: see [server_setup.md](docs/server_setup.md)
