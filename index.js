const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const router = require('./routes/index.js')

app.set('view engine', 'hbs')
app.use('router')
app.use(require("./routes/index.js"));






app.listen(3000, () => console.log("server is running"));