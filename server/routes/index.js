const express = require('express');
const router = express.Router();
const fs = require('../fs/read_file.js');

//example: http://localhost:7777/?course=COMP-0040
fs.get_json(function (err,courses_info) {
    router.get('/', async (req, res) => {
        var course = req.query.course;
        var id_names_list = courses_info.courses_id_names;
        for( var index in id_names_list) {
            if (id_names_list[index] == course) {
                console.log(id_names_list[index]);
                var information = courses_info.Courses[course]
                console.log(information)
                res.send(information);
            }
        }
        //get query parameters
        //res.send(courses_info);
    });
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
