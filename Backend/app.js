const express = require("express");

const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();
var db = require("./config/db");
const init = require("./config/init");
const routes = require("./routes/index");

const app = express();

app.use(cors());


app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
  });

  app.use('/api',routes)
const PORT = process.env.PORT || 5000;
init();

app.listen(PORT,() => {
    console.log(`Server running on the ${PORT}`)
})