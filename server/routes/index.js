const express = require('express');
const router = express.Router();
const fs = require('../fs/read_file.js');

/*
var json_object;
fs.get_json(function (err,data){
    json_object = data;
})*/


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



/*
// Do work here
//example: localhost:7777/?name=jeremy&age=30&cool=false
router.get('/', async (req, res) => {
    var json_object;
    fs.get_json(function (err,data){
        //console.log(data);
        json_object = data;
    })

    const jer = { name: "jeremy", age: 20, cool: true};
    //res.send('Hey! It works!');
    //res.json(jer)
    //res.send(req.query.name);

    //get query parameters
    res.send(req.query);

    //res.render("hello");
});*/

//putting colon behind will give you a variable on each of your requests
//example localhost:7777/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join()
    //req.params to access things in the URL
    //res.send(req.params.name);
    res.send(reverse)
})
module.exports = router;
