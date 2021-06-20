const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const section_Schema = new Schema({
    term_section_id: {
        type: String,
        unique: true
    },
    term_course_id: String,
    course_num: String,
    units: Number,
    section_num: String,
    campus: String,
    section_type: String,
    instr_mode: String,
    attributes: [String],
    status: String,
    capacities: [{
        cap: String,
        total: String,
        available: String,
        cap_type: String
    }],
    classes: [{
        instructor: String,
        room: String,
        campus: String,
        start_time: Number,
        end_time: Number,
        day_of_week: Number,
        time_unspecified: Boolean
    }]
});

section_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Section', section_Schema);