const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");


app.set('view engine', 'hbs')
//app.use('router')




app.set('port', process.env.PORT || 3001)

  app.listen(app.get('port'), () => {
    console.log(`PORT: ${app.get('port')}`)
  })

//app.listen(3000, () => console.log("server is running"));

// "test": "echo \"Error: no test specified\" && exit 1"