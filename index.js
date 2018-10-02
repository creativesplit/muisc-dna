const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");

app.set('view engine', 'hbs')
//app.use('router')






app.listen(3000, () => console.log("server is running"));