const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const apiError_Schema = new Schema({
    type: String,
    userid: String,
    feature: String,
    date: Date,
    status: String,
    errid: String,
    errtitle: String,
    errdetails: String
});

apiError_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ApiError', apiError_Schema, 'analytics');
