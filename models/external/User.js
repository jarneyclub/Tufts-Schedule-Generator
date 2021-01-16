const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const userSchema = new mongoose.Schema({
    username: {
        type: String,
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