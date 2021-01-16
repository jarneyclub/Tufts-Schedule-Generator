const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const promisify = require('es6-promisify');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API for Tufts Schedule Generator',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://tufts-schedule-api.herokuapp.com/api',
      description: 'Production server'
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/docsApi.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

//Enable CORS
app.use("*",function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Content-Type");
    // res.header(
      // 'Access-Control-Allow-Headers',
      // 'access-control-request-headers'
    // );
    next();
});

app.use(express.json());

// handle api routes
app.use('/api', routes);

// handle api docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(__dirname + "/frontend/build"));

app.get("/prototype", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/prototype/v2", "index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/frontend/build", "index.html")); 
});

//export and start the site in start.js
module.exports = app;