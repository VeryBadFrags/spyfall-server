# Server setup - Docker

## Docker

Run the game server inside Docker.

### Setup

```sh
wget -nv -O - https://get.docker.com/ | sh
```

* https://docs.docker.com/engine/install/linux-postinstall/
* https://docs.docker.com/compose/install/

### Start

`update_server.sh`
```sh
#!/bin/bash

docker stop online-spy
docker rm online-spy
docker run -d --restart unless-stopped --pull always -p 8081:8081 --name online-spy verybadfrags/online-spy
```
