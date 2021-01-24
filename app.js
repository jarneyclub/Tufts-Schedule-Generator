const express = require('express');
const mongoose = require("mongoose");
const routes = require('./routes/index');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const app = express();

require('./services/handlers/passport.js');

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
app.use(function (req, res, next) {
    console.log("Applying CORS headers to response");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Content-Type, Origin, Accept");
    // res.header(
      // 'Access-Control-Allow-Headers',
      // 'access-control-request-headers'
    // );
    // console.log("Response thus far: ", res);
    next();
});

app.use(express.json());

// handle api routes
app.use('/api', routes);

// handle api docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//export and start the site in start.js
module.exports = app;