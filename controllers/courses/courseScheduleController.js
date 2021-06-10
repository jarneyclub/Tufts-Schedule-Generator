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
    // get request information
    let requestBody = req.body;
    let objectIds = requestBody.objectIds;
    let filter = requestBody.filter;
    
    collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection
    // console.log("objectIds: ", objectIds);
    // console.log("filter: ", filter);
    var start = Date.now(); // begin timing API endpoint
    let startDB = Date.now(); // start timer
    /* List of Course objects */
    let courses = [];
    for (let index in objectIds) {
        let objectId = objectIds[index];

        let oid = mongoose.Types.ObjectId(objectId);
        console.log("(api/courses/schedule): objectID: ", objectId)
        let document = await collectionCourses.findOne({ '_id': oid });
        console.log("(api/courses/schedule):", "Received course to consider: ", document);
        let course = objectUtils.documentToCourse(document);
        courses.push(course);
    }
    let endDB = Date.now(); // end timer
    let diff = endDB - startDB;
    let tstring = diff.toString() + "ms";
    console.log("(api/courses/schedule): ", "Getting courses from the database took ", tstring)
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
