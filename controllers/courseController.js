const mongoose = require('mongoose');
// TODO: PUT 00 or - if it doesnt exist in the query
// TODO: when no coursenum input, return empty array
exports.getGeneralCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    let reqCourseNum = req.query.cnum.toUpperCase(); // get query string
    if (reqCourseNum === "") { // if no query string, return empty array
        res.json({courses: []});
    }
    else {
        let firstDigit = reqCourseNum.match(/\d/); // will give you the first digit in the string
        let indexFirstDigit = reqCourseNum.indexOf(firstDigit);
        // let numberOfChrsAfterIncludingFirstDig = reqCourseNum.length - indexFirstDigit;
        // if (reqCourseNum[indexFirstDigit - 1] !== "-")
            // reqCourseNum = reqCourseNum.substring(0, indexFirstDigit) + "-" + reqCourseNum.substring(indexFirstDigit, reqCourseNum.length);
        // console.log("(getGeneralCourses) reqCourseNum: ", reqCourseNum)
        let dbCoursesGeneral = mongoose.connection.collection("courses_general"); // get MongoDB collection
        // get cursor of courses from database with queried course number
        let cursor = dbCoursesGeneral.find({"course_num": {"$regex": '^' + reqCourseNum}}).sort({"course_num": 1});
        // convert cursor to list
        let documents = [];
        await cursor.forEach((doc) => {
            // parse database document
            let docToInsert = {
                "gen_course_id" : doc["_id"].valueOf(),
                "course_num"    : doc["course_num"],
                "course_title"  : doc["course_title"],
                "units_esti"    : doc["units_esti"]
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
}

exports.getTermCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    // get query strings
    let reqCourseNum = req.query.cnum.toUpperCase();
    if (reqCourseNum === "") { // if no query string, return empty array
        res.json({courses: []});
    }
    else {
        let reqAttr      = req.query.attr;
        let dbCourses = mongoose.connection.collection("courses"); // get MongoDB collection
        // get cursor of courses from database with query parameters
        let cursor;
        if ( reqCourseNum === "" && reqAttr === "" ) {
            /* no parameters are provided */
            cursor = dbCourses.find().sort({"course_num": 1});
        }
        else {
            // let re = new RegExp(reqCourseNum, "g");
            if ( reqCourseNum === "" ) {
                /* only attribute is provided */
                cursor = dbCourses.find({"attributes": {"$all": [reqAttr]}}).sort({"course_num": -1});
            }
            else if ( reqAttr === "" ) {
                /* only course_num is provided */
                cursor = dbCourses.find({ "course_num": { "$regex": '^' + reqCourseNum } }).sort({"course_num": -1});
            }
            else {
                /* all parameters are provided */
                cursor = dbCourses.find({
                    "course_num": {
                        "$regex": '^' + reqCourseNum
                    },
                    "attributes": {
                        "$all": [reqAttr]
                    }
                }).sort({"course_num": -1});
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
}

exports.getAttributes = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    let attributesCol = mongoose.connection.collection("attributes"); // get MongoDB collection
    // get cursor of courses from database with queried course number
    let cursor = attributesCol.find();
    // convert cursor to list
    let documents = [];
    documents.push("");
    await cursor.forEach((doc) => {
        // parse database document
        documents.push(doc["text"]);
    });
    var end = Date.now(); // End timing API endpoint
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";
    // send response
    let response = {
        attributes: documents,
        time_taken: timeTakenString
    };
    res.json(response);
}

exports.getPrograms = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    let attributesCol = mongoose.connection.collection("program_names"); // get MongoDB collection
    // get cursor of program names from database with queried course number
    let cursor = attributesCol.find();
    // convert cursor to list
    let documents = [];
    documents.push("");
    await cursor.forEach((doc) => {
        // append program names that are not empty string
        if (doc["name"] != "")
            documents.push(doc["name"]);
    });
    console.log("(courseCntrl/getPrograms) documents: ", documents);
    // send response
    let response = {
        names: documents,
        time_taken: (Date.now() - start).toString() + "ms"
    };
    res.json(response);

}