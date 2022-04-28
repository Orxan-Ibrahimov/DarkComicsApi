const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require("morgan");
require("dotenv/config");
const api = process.env.API_URL;

const characterRouter = require('./routers/characters');
const cityRouter = require('./routers/cities');

app.use(`${api}/cities`,cityRouter);
app.use(`${api}/characters`,characterRouter);


app.use(express.json());
app.use(morgan('tiny'));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


mongoose.connect(process.env.CONNECTION_STRING, 
    {
      useNewUrlParser: true,
      useUnifiedTopology:true,
      dbName:'dc-database'
    })
  .then(() => {
  console.log("database Connected...");
  })
  .catch((err) => {
    console.log("database wasn't Connected");
    console.log(err);
  });

  app.listen( 3000, () => {});