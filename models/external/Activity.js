const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const activity_Schema = new Schema({
    userid: String,
    feature: String,
    date: Date
});

activity_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Activity', activity_Schema);