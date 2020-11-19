const express = require('express');
const router = express.Router();
const fs = require('./fs/read_file.js');

const Section = require('./utils/objects/classes/Section.js');
const Course = require('./utils/objects/classes/Course.js');
const Tree1 = require('./utils/Tree1.js');

const phase1 = require('./utils/phase1Utils.js');
const objectUtils = require('./utils/apiUtils.js');
const testUtils = require('./utils/testUtils.js');

/* courses_info is the JSON object with raw information on the course catalog */
fs.get_json(function (err,courses_info) {

    /* Initialize data structure */
    /* courseDictionary = {
        courseID : Course object
    }   
    */
    var courseDictionary = objectUtils.initializeCourseDictionary(courses_info);

    /*
    * Handle GET requests for list of all courses
    * USAGE: http://localhost:7777/api/courses/list
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
    * USAGE: http://localhost:7777/api/course/?course=COMP-0040 
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
    * USAGE: http://localhost:7777/api/courses/?courses=COMP-0015&courses=COMP-0011
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
    * USAGE: http://localhost:7777/api/findCoursesInRange/?start=100&end=400?courses=COMP-0015&courses=COMP-0011
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
    * USAGE: http://localhost:7777/api/test
    * start and end are times in integer format
    * NOTE: ONLY ACCEPTS COURSE ID
    * TODO: NOT IMPLEMENTED
    */
    router.get('/test', async (req, res) => {
        console.log("-------beginning test------");
        var start = Date.now();
        /* SELECT RANDOM COURSES AND SOME MANUALLY */

        // get 5 random courses
        let selectedCourses = []; // array of course IDS
        while (selectedCourses.length < 5) {
            let randomCourseID = testUtils.getRandomCourse(courseDictionary).getCourseName();
            // check if random course already exists in array
            let doesntExist = true;
            for (let i = 0; i < selectedCourses.length; i++ ) {
                if (selectedCourses[i] == randomCourseID) {
                    doesntExist = false;
                }
            }

            if (doesntExist)
                selectedCourses.push(randomCourseID);
        }
        
        // manual selection of course
        selectedCourses.push("CHEM-0011");

        console.log("selected courses: ", selectedCourses);
         /* e.g.
            mapCourseToSectionType: {
                'SPN-0032': { Lecture: [[Object]] },
                'AMER-0186': { Lecture: [[Object], [Object]] },
                'TPS-0161': { Lecture: [[Object]] },
                'NUTR-0211': { Lecture: [] },
                'PHY-0293': { Lecture: [[Object]] }
            }
        */

        let mapCourseToSectionType = phase1.mapCoursesToSectionTypes(courseDictionary, selectedCourses);
        
        /* let mapTree1Courses = {
            COURSEID: {
                "Lecture": Tree1()
            },
            COURSEID2: {
                
            },
            etc.
        } */
        let mapTree1Courses = phase1.mapCoursesToTree1s(mapCourseToSectionType);

        console.log("phase 1 tree mapping: ", mapTree1Courses);

        for (let key in mapTree1Courses) {
            for (let secType in mapTree1Courses[key]) {
                mapTree1Courses[key][secType].print();
            }
        }
        var end = Date.now();
        var difference = end - start;
        var executionTime = "executionTime: "  + difference + "ms";
        res.send("Test results:" + executionTime);
        console.log("---ending test-----", "\n");
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
//example localhost:7777/api/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join()
    //req.params to access things in the URL
    //res.send(req.params.name);
    res.send(reverse)
})
module.exports = router;
