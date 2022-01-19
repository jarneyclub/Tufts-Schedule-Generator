const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const frontendUse_Schema = new Schema({
    type: String,
    date: Date
});

frontendUse_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('FrontendUse', frontendUse_Schema, 'analytics');
