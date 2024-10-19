# Server setup

Steps required to setup the server on <spy.verybadfrags.com>

Ubuntu 20.04 LTS

## Initial setup

### [Nginx](https://www.nginx.com)

```shell
sudo apt update && sudo apt install nginx -y
```

Create the Nginx server block

`/etc/nginx/sites-available/spy.verybadfrags.com`

```nginx
server {
        listen 80;
        listen [::]:80;

        server_name spy.verybadfrags.com www.spy.verybadfrags.com;

        location / {
            proxy_pass http://127.0.0.1:8081;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
}
```

Enable the site

```shell
sudo ln -s /etc/nginx/sites-available/spy.verybadfrags.com /etc/nginx/sites-enabled/

# Check that the config is valid
sudo nginx -t

sudo systemctl restart nginx
```

### [ufw](https://help.ubuntu.com/community/UFW)

```shell
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### [Let's Encrypt](https://letsencrypt.org)

```shell
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d spy.verybadfrags.com -d www.spy.verybadfrags.com
sudo nginx -t
sudo systemctl restart nginx
```

### Updates and security

```shell
sudo apt install unattended-upgrades
sudo apt install fail2ban
```

Proceed with either [server_pm2.md](server_pm2.md) or
[server_docker.md](server_docker.md).
