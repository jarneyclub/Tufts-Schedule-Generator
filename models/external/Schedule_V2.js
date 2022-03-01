const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const scheduleV2_Schema = new Schema({
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
        Monday:      [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}],
        Tuesday:     [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}],
        Wednesday:   [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}],
        Thursday:    [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}],
        Friday:      [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}],
        TimeUnspecified: [{type: Schema.Types.ObjectId, 
                        ref: 'Section'}]
    },
    courses: [{
        term_course_id: String,
        course_num: String,
        course_title: String,
        units_esti: Number
    }],
    term: String
});

schedule_SchemaV2.plugin(mongodbErrorHandler);

module.exports = mongoose.model('ScheduleV2', scheduleV2_Schema);