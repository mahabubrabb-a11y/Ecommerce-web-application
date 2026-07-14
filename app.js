const express = require ('express')
const app =  express();
const ratelimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./src/routes/api')
//const { error } = require('console');
//const { Route } = require('express');
const dotENV = require('dotenv');
//app.use(express.json());

dotENV.config();


//mongodb connect


let URL = "mongodb+srv://mahabubrabb_db_user:6oZkAC4Z7oEFQRGj@cluster0.lxcfrdz.mongodb.net/?appName=Cluster0";
let option = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
};


mongoose
  .connect(URL, option)
  .then(() => {
    console.log(' Database connected successfully');
  })
  .catch((err) => {
    console.error(' Database connection error:', err.message);
  }); 

  mongoose.set("strictQuery", false)


  //global middleware 

  app.use(cookieParser())
app.use(cors({
   origin : ['http://localhost:5017','http://localhost:5173', 'http://localhost:3001'],
   credentials : true,
}));



app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "http:"],
      },
    },
  })
);


//app.use(mongoSanitize())
app.use(hpp())

app.use(express.json({limit : '50mb'}));
app.use(express.urlencoded({limit : '50mb'}));

const limiter = ratelimit({
  max: 10000,
  windowMs: 15 * 60 * 1000
})
app.use(limiter);

app.use("/api/v1", router)
app.use("/api/v1/get-file", express.static("uploads"))


//frontend server

module.exports = app;




