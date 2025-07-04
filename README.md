# 🕵️ Spyfall - Server

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Docker Build & Publish](https://github.com/VeryBadFrags/spyfall-server/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/VeryBadFrags/spyfall-server/actions/workflows/docker-publish.yml)

A multiplayer social deduction game inspired by
[Spyfall](https://hwint.ru/portfolio-item/spyfall/).

[♟️ Play the game](https://spyfall.verybadfrags.com)

<details>
    <summary>🖥️ Game screenshot</summary>
    <img alt="Game screenshot" src="docs/spyfall-example-01.png"/>
</details>

## Stack

🛠️ Built with [Deno](https://deno.com),
[Typescript](https://www.typescriptlang.org), and
[socket.io](https://socket.io).

- [💾 View the client source code](https://github.com/VeryBadFrags/spyfall-client)

## Setup

## Run locally

### With [mise](https://mise.jdx.dev)

```sh
mise install # only required once
mise dev
```

### With [Deno](https://deno.com)

```sh
make dev
```

### With [Docker](https://www.docker.com)

```sh
make docker-dev
```
