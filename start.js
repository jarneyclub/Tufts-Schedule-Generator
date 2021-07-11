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
// start app
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});