# 🕵️ Spyfall - Server

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE.txt)
[![Docker Build & Publish](https://github.com/VeryBadFrags/spyfall-server/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/VeryBadFrags/spyfall-server/actions/workflows/docker-publish.yml)
[![Latest version](https://img.shields.io/github/v/tag/VeryBadFrags/spyfall-server?sort=semver)](https://github.com/VeryBadFrags/spyfall-server/tags)

A multiplayer social deduction game inspired by
[Spyfall](https://hwint.ru/portfolio-item/spyfall/).

[♟️ Play the game](https://spyfall.verybadfrags.com)

<details>
    <summary>🖥️ Game screenshot</summary>
    <img alt="Game screenshot" src="docs/spyfall-example-01.png"/>
</details>

## Stack

🛠️ Built with [Node](https://nodejs.org),
[Typescript](https://www.typescriptlang.org), and
[socket.io](https://socket.io).

- [💾 View the client source code](https://github.com/VeryBadFrags/spyfall-client)

## Run locally

### With [mise](https://mise.jdx.dev)

```sh
mise install # only required once
mise dev
```

### With [Node](https://nodejs.org)

```sh
make dev
```

### With [Docker](https://www.docker.com)

```sh
make docker-dev
```
