const express = require('express');
const router = express.Router();
const fs = require('./fs/read_file.js');

//example: http://localhost:7777/?course=COMP-0040
fs.get_json(function (err,courses_info) {
    router.get('/', async (req, res) => {
        var course = req.query.course;
        var id_names_list = courses_info.courses_id_names;
        var course_found = false;
        for( var index in id_names_list) {
            if (id_names_list[index] == course) {
                console.log(id_names_list[index]);
                var information = courses_info.courses[course];
                console.log(information);
                var response = {
                    "status": "200",
                    "data": {
                        "course": course,
                        "info": information
                    }
                };
                res.send(response);
                course_found = true;
            }
        }
        if ( !course_found ) {
            error_response = {
                "status": "400",
                "error": "Client Error: Course does not exist"
            }
            res.send(error_response)
        }
        //get query parameters
        //res.send(courses_info);
    });
    //format:
    //example: http://localhost:7777/test/?courses=COMP-0015&courses=COMP-0011
    router.get('/test/', async (req, res) => {
        res.send(req.query);
    })
})

//putting colon behind will give you a variable on each of your requests
//example localhost:7777/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join()
    //req.params to access things in the URL
    //res.send(req.params.name);
    res.send(reverse)
})
module.exports = router;
