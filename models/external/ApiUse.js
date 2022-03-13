const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const apiUse_Schema = new Schema({
    type: String,
    userid: String,
    feature: String,
    date: Date
});

apiUse_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ApiUse', apiUse_Schema, 'analytics');
