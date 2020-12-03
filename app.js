const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const promisify = require('es6-promisify');
const path = require('path');
const app = express();

// use static build pages
app.use(express.static(path.join(__dirname, 'build')));

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

// handle api routes
app.use('/api', routes);

// divert all other routing to react app
// app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
// });
// app.use('/', express.static(path.join(__dirname, "/frontend/build")))
// app.use('/static', express.static(path.join(__dirname, "/frontend/build/static")));
// app.use('/manifest.json', express.static(path.join(__dirname, "/frontend/build", "manifest.json")))

app.use(express.static(__dirname + "/frontend/build")); //
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/frontend/build", index.html)); // <- try "index.html"
});

//export and start the site in start.js
module.exports = app;