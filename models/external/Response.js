const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const response_Schema = new Schema({
    name: String,
    email: String,
    message: String,
    date: Date
});

response_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Response', response_Schema);