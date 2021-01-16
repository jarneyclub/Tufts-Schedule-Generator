const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('password-local-mongoose');


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please enter your username!'
    },
    password: {
        type: String,
        trim: true,
        required: 'Please enter your password!'
    }
});


module.exports = mongoose.model('User', userSchema);