const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const fs = require('fs'); 
const path = require("path");

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
// app.set('port', process.env.PORT || 7777);
// const server = app.listen(app.get('port'), () => {
//     console.log(`Express running → PORT ${server.address().port}`);
// });
console.log(process.env.SSL_PKEY.replace(/\\n/gm, '\n'))
console.log(process.env.CSR.replace(/\\n/gm, '\n'))
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    key : fs.readFileSync(path.resolve(__dirname, 'routes/generated-private-key.txt')),
    cert: fs.readFileSync(path.resolve(__dirname, 'routes/generated-csr.txt'))
    // key: process.env.SSL_PKEY.replace(/\\n/gm, '\n'),
    // cert: process.env.CSR.replace(/\\n/gm, '\n'),
}, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
