const express = require('express');
const router = express.Router();
const fs = require('./fs/read_file.js');

var testResponse = "ok";

fs.get_json(function (err,courses_info) {
    /* 
    * Handle GET requests for information on a single course 
    * USAGE: http://localhost:7777/course/?course=COMP-0040 
    * NOTE: ONLY ACCEPTS COURSE ID 
    * */
    router.get('/course/', async (req, res) => {

        var course = req.query.course; // name of course from request URL query

        var id_names_list = courses_info.courses_id_names; // list of existing course IDs

        /*
        * Success: send information of course
        * Fail: send 400 response
        */
        checkCourseExistence(id_names_list, course).then(
            function(result) {
                var courseID = courses[course];
                var information = courses_info[courseID]; // get course info

                console.log(course);
                console.log(information);

                res.status(200);
                // formulate response body
                var response = {
                    "status": "200",
                    "data": {
                        "course": course,
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

        var courses = req.query.courses; // Requested courses list from URL query
        var id_names_list = courses_info.courses_id_names; // List of existing course IDs

        var promises = []; // promises of all course checks

        // check if each course exists in database
        for ( var index in courses ) {
            promises.push(checkCourseExistence(id_names_list, courses[index]));
        }

        /* Check if all requested courses are valid
        * Success: send information of course
        * Fail: send 400 response
        */
        Promise.all(promises).then(
            function(result) {
                var response = {};
                // append all requested courses' information to response
                for ( var index in courses ) {
                    var courseID = courses[index];

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
    })

    /* Check if requested course exists in database
    * return resolve, reject Promise
    */
    function checkCourseExistence( id_names_list, courseID) {
        return new Promise(( resolve, reject ) => {
            // Traverse course ID list
            for (var index in id_names_list) {
                // Matching course name found
                if (id_names_list[index] == courseID) {
                    // Success
                    resolve(true)
                }
                else {
                    // No match was found after complete list traversal
                    if (index == id_names_list.length - 1) {
                        // Failure
                        reject(new Error("ClientError: A requested course does not exist in the Tufts course catalog"))
                    }
                }
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
