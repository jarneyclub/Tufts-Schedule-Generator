const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const planTerm_Schema = new Schema({
    // plan_term_id is substituted with _id
    term: {
        type: Number,
        min: 2000,
        max: 3000
        // if not provided this is not a user generated issue
    },
    plan_id: mongoose.ObjectId,
    courses: [{
        course_num: String,
        course_title: String,
        units_esti: Number,
        gen_course_id: mongoose.ObjectId
    }]
});

planTerm_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('PlanTerm', planTerm_Schema, "plan_terms");