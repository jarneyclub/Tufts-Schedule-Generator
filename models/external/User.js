const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const user_Schema = new Schema({
    userid: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please enter an email address!'
    },
    first_name: {
        type: String,
        required: 'Please enter your first name!',
        trim: true
    },
    last_name: {
        type: String,
        required: 'Please enter your last name!',
        trim: true
    },
    major: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: "user"
    }
});

user_Schema.plugin(passportLocalMongoose, { usernameField: 'userid'});
user_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', user_Schema);