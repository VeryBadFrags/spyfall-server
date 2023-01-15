# Server setup - pm2

Run locally using Node and pm2.

## Setup

### [Node](https://nodejs.org/)

Get nvm: <https://github.com/nvm-sh/nvm>

```shell
source ~/.bashrc
nvm install --lts
```

### Server code

Get the source code from GitHub.

```shell
git clone https://github.com/VeryBadFrags/online-spy.git
cd online-spy
npm ci --no-audit --only=prod --no-optional
npm run build
```

### [pm2](https://www.npmjs.com/package/pm2)

```shell
npm install pm2@latest -g
pm2 startup
pm2 start server/index.js --name online-spy
pm2 save
```

## Update script

`update_server.sh`

```shell
#!/bin/bash

cd online-spy
git pull --recurse-submodules
npm ci --no-audit --only=prod --no-optional
make
pm2 restart online-spy
```

## Useful commands

```shell
pm2 logs
pm2 list
pm2 info id
pm2 monit
```
