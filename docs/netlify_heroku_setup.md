# Run on Netlify & Heroku

## Netlify

```sh
npm install netlify-cli -g
netlify login
netlify init
# npm run build
# build/
```

## Heroku

Get the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

```sh
heroku login
heroku create
# Apps using Socket.io should enable session affinity
heroku features:enable http-session-affinity
```

- Go to https://dashboard.heroku.com/
- Select App
- Go to Deploy tab
- Connect App to GitHub repo
- Deploy

Check logs

```sh
heroku logs --tail
```
