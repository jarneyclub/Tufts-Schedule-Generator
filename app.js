const express = require('express');
const passport = require('passport');
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
    version: '0.1.1',
  },
  servers: [
    {
        url: "https://jarney.club/api",
        description: "Production server"
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Content-Type, Origin, Accept, Authorization");
    // res.header(
      // 'Access-Control-Allow-Headers',
      // 'access-control-request-headers'
    // );
    // console.log("Response thus far: ", res);
    next();
});

app.use(express.json());
app.use(passport.initialize());

// handle api routes
app.use('/api', routes);

// handle api docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

//export and start the site in start.js
module.exports = app;