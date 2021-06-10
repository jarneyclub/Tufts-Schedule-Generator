const mongoose = require('mongoose');

exports.getGeneralCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    let reqCourseNum = req.query.cnum; // get query string
    let dbCoursesGeneral = mongoose.connection.collection("courses_general"); // get MongoDB collection
    // get cursor of courses from database with queried course number
    let cursor = dbCoursesGeneral.find({"course_num": reqCourseNum});
    // convert cursor to list
    let documents = [];
    await cursor.forEach((doc) => {
        // parse database document
        let docToInsert = {
            "course_num"   : doc["course_num"],
            "course_title" : doc["course_title"],
            "units_esti"   : doc["units_esti"]
        };
        documents.push(docToInsert);
    });
    var end = Date.now(); // End timing API endpoint
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";
    // send response
    let response = {
        courses: documents,
        time_taken: timeTakenString
    };
    res.json(response);
}

exports.getTermCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    // get query strings
    let reqCourseNum = req.query.cnum;
    let reqAttr      = req.query.attr;
    let dbCourses = mongoose.connection.collection("courses"); // get MongoDB collection
    // get cursor of courses from database with query parameters
    let cursor;
    if ( reqCourseNum === "" && reqAttr === "" ) {
        /* no parameters are provided */
        cursor = dbCourses.find();
    }
    else {
        let re = new RegExp(reqCourseNum, "g");
        if ( reqCourseNum === "" ) {
            /* only attribute is provided */
            cursor = dbCourses.find({"attributes": {"$all": [reqAttr]}});
        }
        else if ( reqAttr === "" ) {
            /* only course_num is provided */
            cursor = dbCourses.find({
                "course_num": re
            })
        }
        else {
            /* all parameters are provided */
            cursor = dbCourses.find({
                "course_num": re,
                "attributes": {
                    "$all": [reqAttr]
                }
            })
        }
    }
    // convert cursor to list
    let documents = [];
    await cursor.forEach((doc) => {
        // parse database document
        let docToInsert = {
            "term_course_id": doc["term_course_id"],
            "course_num"    : doc["course_num"],
            "course_title"  : doc["course_title"],
            "units_esti"    : doc["units_esti"],
            "attributes"    : doc["attributes"],
            "closed"        : doc["closed"],
            "last_term"     : doc["last_term"]
        };
        documents.push(docToInsert);
    });
    var end = Date.now(); // End timing API endpoint
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";
    // send response
    let response = {
        courses: documents,
        time_taken: timeTakenString
    };
    res.json(response);
}