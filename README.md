# Online Spy

[![Netlify Status](https://api.netlify.com/api/v1/badges/9271d1dc-174d-4df4-8e41-13d63b9dab73/deploy-status)](https://app.netlify.com/sites/distracted-villani-c928ee/deploys)
[![Build status](https://img.shields.io/github/workflow/status/VeryBadFrags/online-spy/NodeCI)](https://github.com/VeryBadFrags/online-spy/actions?query=workflow%3ANodeCI)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/VeryBadFrags/online-spy/blob/master/LICENSE)

A multiplayer social deduction game inspired by [Spyfall](https://hwint.ru/portfolio-item/spyfall/). Built with Node and [socket.io](https://socket.io).

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
- Netlify + Heroku: see [netlify_heroku_setup.md](docs/netlify_heroku_setup.md)
