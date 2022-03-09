/*
* Name: start.js
* Initialization required for the functioning of the server must be 
* done in this file.
* 
* 
*/
const mongoose = require('mongoose');

// import environmental variables
require('dotenv').config({path: '.env'});

// connect to database and handle bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Error connecting with Mongoose: ${err.message}`);
});

// import all models
require('./models/external/User');
require('./models/external/Plan');
require('./models/external/PlanTerm');
require('./models/external/DegreeReqPrivate');
require('./models/external/DegreeReqPublic');
require('./models/external/Schedule');
require('./models/external/Section');
require('./models/external/Response');
require('./models/external/ErrorActivity');
require('./models/external/NormalActivity');
require('./models/external/ApiError');
require('./models/external/ApiUse');
require('./models/external/FrontendUse');
// start app
const app = require('./app');
app.set('port', process.env.DEV_PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});