const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const degreeReqPublic_Schema = new Schema({
    // pub_dr_id is substituted with _id
    program_name: {
        type: String,
        unique: false,
        trim: true,
        required: 'Please enter the program name!'
    },
    school: {
        type: String,
        unique: false,
        trim: true,
        required: 'Please enter the school name!'
    },
    degree: {
        type: String,
        unique: false,
        trim: true,
        required: 'Please enter the degree type!'
    },
    parts: [{
        _id: false,
        part_name: {
            type: String,
            trim: true,
            required: 'Please enter the names of all parts of program requirement',
        },
        part_desc: String,
        part_reqs: [{
            _id: false,
            course_num: {
                type: String,
                trim: true
            },
            course_title: {
                type: String,
                trim: true
            }}]
    }],
    date_created: {
        type: Date,
        default: Date.now
    }
});

degreeReqPublic_Schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('DegreeReqPublic', degreeReqPublic_Schema, "degree_reqs_public");