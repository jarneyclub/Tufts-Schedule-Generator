const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const plans_Schema = new Schema({
    // plan_id is substituted with _id
    plan_name: {
        type: String,
        trim: true,
        required: 'Please enter a plan name!'
    },
    user_id: {
        type: String,
        // if not provided this is not a user generated issue
    }
});

plans_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Plan', plans_Schema, "plans");