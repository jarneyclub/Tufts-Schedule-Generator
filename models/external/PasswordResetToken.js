const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const passwordReset_Schema = new Schema({
    hash: String,
    userid: String,
    date: Date,
    expire: Number
});

passwordReset_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('PasswordResetToken', passwordReset_Schema, 'password_reset_token');
