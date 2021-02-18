// Express static site
const express = require("express");
const app = express();

const clientPath = "build";
app.use(express.static(clientPath));
