const express = require('express');
const router = express.Router();
const fs = require('./fs/read_file.js');
const Section = require('./utils/objects/classes/Section.js');
const Course = require('./utils/objects/classes/Course.js');
const objectUtils = require('./utils/objects/classes/helpers.js');
var testResponse = "ok";

/* courses_info is the JSON object with raw information on the course catalog */
fs.get_json(function (err,courses_info) {

    var courses = courses_info.courses; // get courses object from JSON

    /* Initialize data structure */
    /* courseDictionary = {
        courseID : Course object
    }   
    */
    var courseDictionary = objectUtils.initializeCourseDictionary(courses);


    router.get('/', async (req, res) => {
        res.send("API that helps generate semester schedule based on user specifications")
    })
    /*
    * Handle GET requests for list of all courses
    * USAGE: http://localhost:7777/courses/list
    * */
    router.get('/courses/list', async(req, res) => {
        console.log("in endpoint /courses/list");

        // populate list of course IDs
        var listCourses = [];
        for (courseID in courseDictionary) {
            listCourses.push(courseID);
        }
        res.status(200);
        // formulate response body
        var response = {
            "status": "200",
            "list_courseids": listCourses
            }

        res.send(response);
    })

    /* 
    * Handle GET requests for information on a single course 
    * USAGE: http://localhost:7777/course/?course=COMP-0040 
    * NOTE: ONLY ACCEPTS COURSE ID 
    * */
    router.get('/course/', async (req, res) => {
        console.log("in router.get/course/");
        var courseID = req.query.course; // name of course from request URL query

        /*
        * Success: send information of course
        * Fail: send 400 response
        */
        checkCourseExistenceFast(courseDictionary, courseID).then(
            function(result) {
                var information = courses_info.courses[courseID]; // get course info

                res.status(200);
                // formulate response body
                var response = {
                    "status": "200",
                    "data": {
                        "course": courseID,
                        "info": information
                    }
                };
                res.send(response);
            },
            function(error) {

                res.status(400);
                // formulate response body
                var response = {
                    Error: error.message
                }
                res.send(response)
            }
        )
    });

    /*
    * Handle GET requests for information on a list of courses
    * USAGE: http://localhost:7777/courses/?courses=COMP-0015&courses=COMP-0011
    * NOTE: ONLY ACCEPTS COURSE ID
    */
    router.get('/courses/', async (req, res) => {

        var coursesRequested = req.query.courses; // Requested courses list from URL query

        /* Promises are used because it is required when there are various types of responses to the query*/
        var promises = []; // promises of all course checks 
    
        // check if each course exists in database
        for ( var index in coursesRequested ) {
            promises.push(checkCourseExistenceFast(courseDictionary, coursesRequested[index]));
        }

        /* Check if all requested courses are valid
        * Success: send information of course
        * Fail: send 400 response
        */
        Promise.all(promises).then(
            function(result) {
                var response = {};
                // append all requested courses' information to response
                for ( var index in coursesRequested ) {
                    var courseID = coursesRequested[index];

                    var information = courses_info.courses[courseID]; // get course info

                    response[courseID] = information; // append to response
                }

                res.send(response);
            },
            function (error) {
                res.status(400);
                // formulate response body
                var response = {
                    Error: error.message
                }
                res.send(response)
            }
        )
    });

    /*
    * Retrieve a schedule of a typical week of classes from chosen courses and times within given bounds
    * USAGE: http://localhost:7777/findCoursesInRange/?start=100&end=400?courses=COMP-0015&courses=COMP-0011
    * start and end are times in integer format
    * NOTE: ONLY ACCEPTS COURSE ID
    * TODO: NOT IMPLEMENTED
    */
    router.get('/coursesInRange/', async (req, res) => {
        var coursesRequested = req.query.courses; // Requested courses list from URL query
        var startTime = req.query.start;
        var endTime = req.query.end;

        /* Promises are used because it is required when there are various types of responses to the query*/
        var promises = []; // promises of all course checks 

        // check if each course exists in database
        for (var index in coursesRequested) {
            promises.push(checkCourseExistenceFast(courseDictionary, coursesRequested[index]));
        }

        /* Check if all requested courses are valid
        * Success: send information of course
        * Fail: send 400 response
        */
        Promise.all(promises).then(
            function (result) {
                var response = {};
                // append all requested courses' information to response
                for (var index in coursesRequested) {
                    var courseID = coursesRequested[index];

                    var information = courses_info.courses[courseID]; // get course info

                    response[courseID] = information; // append to response
                }

                res.send(response);
            },
            function (error) {
                res.status(400);
                // formulate response body
                var response = {
                    Error: error.message
                }
                res.send(response);
            }
        )
    })

    /*
    * Test data structure and algorithms
    * USAGE: http://localhost:7777/test
    * start and end are times in integer format
    * NOTE: ONLY ACCEPTS COURSE ID
    * TODO: NOT IMPLEMENTED
    */
    router.get('/test', async (req, res) => {
        console.log("-------beginning test------");
        res.send("Test results:");

        // get random courses

        // get a schedule from these courses

    })


    /* Check if requested course exists in database
    * return resolve, reject Promise
    TODO: replace promises with this function
    * Time complexity: O(1)
    */
    function checkCourseExistenceFast( objectCourses, courseID ) {
        return new Promise((resolve, reject) => {

            if (objectCourses[courseID] !== undefined) {
                resolve(true);
            }
            else {
                console.log(courseID)
                reject(new Error("ClientError: A requested course does not exist in the Tufts course catalog"));
            }
        })
    }
});
//putting colon behind will give you a variable on each of your requests
//example localhost:7777/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join()
    //req.params to access things in the URL
    //res.send(req.params.name);
    res.send(reverse)
})
module.exports = router;
