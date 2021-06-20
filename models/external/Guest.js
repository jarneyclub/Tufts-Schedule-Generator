const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const guest_Schema = new Schema({
    userid: {
        type: String,
        unique: true
    },
    guest: {
        type: Boolean,
        default: true
    }
});

guest_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Guest', guest_Schema);