const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const normalactivity_Schema = new Schema({
    userid: String,
    feature: String,
    isError: Boolean,
    date: Date
});

normalactivity_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('NormalActivity', normalactivity_Schema);