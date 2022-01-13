const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const apiError_Schema = new Schema({
    type: String,
    status: String,
    errid: String,
    feature: String,
    userid: String,
    details: String,
    date: Date
});

apiError_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ApiError', apiError_Schema, 'analytics');
