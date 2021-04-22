const mongoose = require('mongoose');
const CourseSchedule = require('../../services/generateCourseSchedule/generateCourseSchedule.js');
const objectUtils = require('../../services/apiUtils.js');
const timeUtils = require('../../services/generateCourseSchedule/utils/timeUtils.js');

/*
* Handle POST request: generate a weekly schedule
* given MongoDB ObjectId stringified of courses and a filter
* body: {
*   objectIds: [xxxxxx,xxxxx,xxxxxx,xxxxxx,xxxxx],
*   filter: {
*       time: {
*               Monday: [{
*                   time_earliest:
*                   time_latest:
*               }],
*               Tuesday: [{
*
*               }]
*           },
*       "misc" : {
*           "ignoreTU": bool,
*           "ignoreM": bool
*       }
*   }
*
* }
*
*/
exports.generateCourseSchedule = async (req, res) => {

    let requestBody = req.body;

    collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let objectIds = requestBody.objectIds;
    let filter = requestBody.filter;
    // console.log("objectIds: ", objectIds);
    // console.log("filter: ", filter);

    var start = Date.now(); // begin timing API endpoint

    let dayToInteger = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    }

    /* translate strings in to integers for API */
    let newFilter = {
        time: {},
        misc: filter.misc
    }
    for (let key in filter.time) {
        let integer = dayToInteger[key];
        newFilter.time[integer] = filter.time[key];

        let arrayTimes = newFilter.time[integer];
        for (let i = 0; i < arrayTimes.length; i++) {
            let strTimeEarliest = filter.time[key][i].time_earliest;
            let strTimeLatest = filter.time[key][i].time_latest;

            let intTimeForEarliest = timeUtils.militaryTimeToInteger(strTimeEarliest);
            let intTimeForLatest = timeUtils.militaryTimeToInteger(strTimeLatest);
            newFilter.time[integer][i].time_earliest = intTimeForEarliest;
            newFilter.time[integer][i].time_latest = intTimeForLatest;
        }
    }

    // console.log("object: ", newFilter.time);
    
    /* List of Course objects */
    let courses = [];
    for (let index in objectIds) {
        let objectId = objectIds[index];

        let oid = mongoose.Types.ObjectId(objectId);
        let document = await collectionCourses.findOne({ '_id': oid });
        console.log("(api/courses/schedule):", "Received course to consider: ", document);
        let course = objectUtils.documentToCourse(document);
        courses.push(course);
    }



    CourseSchedule.generateCourseSchedule(courses, newFilter)
    .then(
        (weeklySchedule) => {
            var end = Date.now(); // End timing API endpoint
            var difference = end - start;
            let timeTakenString = difference.toString() + "ms";

            let response = {
                data: weeklySchedule,
                time_taken: timeTakenString
            }

            res.json(response);
        },
        (error) => {
            var end = Date.now(); // End timing API endpoint
            var difference = end - start;
            let timeTakenString = difference.toString() + "ms";

            let response = {
                error: error,
                time_taken: timeTakenString
            };

            res.status(400);

            res.json(response)
        }
    )
}

exports.sendTestOIDs = async (req, res) => {

    let courses = [];

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let courseIds = ['COMP-0015', 'CHEM-0001', 'BIO-0044', 'CEE-0136', 'MATH-0042'];
    let oids = [];
    for (let index in courseIds) {
        let courseId = courseIds[index];

        let document = await collectionCourses.findOne({ 'course_id': courseId });
        let oid = document._id.toString();
        let course = objectUtils.documentToCourse(document);

        courses.push(course);
        oids.push(oid)
    }

    res.send(oids);
}