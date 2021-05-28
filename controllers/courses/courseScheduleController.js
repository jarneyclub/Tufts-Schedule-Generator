const mongoose = require('mongoose');
const CourseSchedule = require('../../services/generateCourseSchedule/generateCourseSchedule.js');
const objectUtils = require('../../services/apiUtils.js');

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
    let startDB = Date.now(); // start timer
    
    /* List of Course objects */
    let courses = [];
    for (let index in objectIds) {
        let objectId = objectIds[index];

        let oid = mongoose.Types.ObjectId(objectId);
        // console.log("(api/courses/schedule): objectID: ", objectId) //!!!!!
        let document = await collectionCourses.findOne({ '_id': oid });
        // console.log("(api/courses/schedule):", "Received course to consider: ", document); //!!!!!
        let course = objectUtils.documentToCourse(document);
        courses.push(course);
    }

    let endDB = Date.now(); // end timer
    let diff = endDB - startDB;
    let tstring = diff.toString() + "ms";
    // console.log("(api/courses/schedule): ", "Getting courses from the database took ", tstring) //!!!!!

    CourseSchedule.generateCourseSchedule(courses, filter)
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