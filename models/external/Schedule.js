const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const schedule_Schema = new Schema({
    // sched_id is substituted with _id
    user_id: {
        type: String
        // if not provided this is not a user generated issue
    },
    sched_name: {
        type: String,
        unique: false,
        trim: true,
        required: 'Please enter the program name!'
    },
    filter: {
        misc: {
            ignoreTU: Boolean,
            ignoreM: Boolean,
            ignoreClosed: Boolean,
            ignoreWL: Boolean
        },
        time: {
            Monday: [{time_earliest: String, time_latest: String}],
            Tuesday: [{ time_earliest: String, time_latest: String }],
            Wednesday: [{ time_earliest: String, time_latest: String }],
            Thursday: [{ time_earliest: String, time_latest: String }],
            Friday: [{ time_earliest: String, time_latest: String }]
        }
    },
    events: {
        Monday:      [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
        Tuesday:     [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
        Wednesday:   [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
        Thursday:    [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
        Friday:      [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
        TimeUnspecified: [{details: String, location: String, name: String, time_start: String, time_end: String, term_section_id: String, instructors: String}]
    },
    courses: [{
        term_course_id: String,
        course_num: String,
        course_title: String,
        units_esti: Number
    }],
    term: String
});

schedule_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Schedule', schedule_Schema);