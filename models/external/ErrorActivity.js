const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const erroractivity_Schema = new Schema({
    userid: String,
    feature: String,
    isError: Boolean,
    status: String,
    error: String,
    date: Date
});

erroractivity_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ErrorActivity', erroractivity_Schema);