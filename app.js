const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const promisify = require('es6-promisify');

const app = express();

//Enable CORS
app.use("*",function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'access-control-request-headers'
    );
    next();
});

// turn raw requests into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handle routes
app.use('/', routes);

//export and start the site in start.js
module.exports = app;