const http = require('http');
const express = require('express');

// Express static site
const app = express();
const staticServer = http.createServer(app);

const clientPath = 'build';
const staticPort = 8080;
app.use(express.static(clientPath));

staticServer.listen(staticPort, () => {
    console.log(`serving from ${clientPath} on http://localhost:${staticPort}`);
});

const process = require('process')
process.on('SIGINT', () => {
  console.info("Interrupted")
  process.exit(0)
});
