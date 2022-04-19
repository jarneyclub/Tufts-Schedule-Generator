/*
* Name: courseController.js
* API endpoints implementation for course querying related operations
* 
* 
*/

const mongoose = require('mongoose');
// TODO: PUT 00 or - if it doesnt exist in the query
// TODO: when no coursenum input, return empty array

exports.getGeneralCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    
    // let queryMatch = req.query.match_method; // get desired matching method
    // // if no match method specified, set to matchAll as default
    // if (queryMatch === "") 
    // {
    //     queryMatch = "matchAll"; 
    // }
    
    let reqCourseNum = req.query.cnum.toUpperCase(); // get query string
    if (reqCourseNum === "") { // if no query string, return empty array
        res.json({courses: []});
    }
    else {
        let firstDigit = reqCourseNum.match(/\d/); // will give you the first digit in the string
        // let numberOfChrsAfterIncludingFirstDig = reqCourseNum.length - indexFirstDigit;
        // if (reqCourseNum[indexFirstDigit - 1] !== "-")
            // reqCourseNum = reqCourseNum.substring(0, indexFirstDigit) + "-" + reqCourseNum.substring(indexFirstDigit, reqCourseNum.length);
        // console.log("(getGeneralCourses) reqCourseNum: ", reqCourseNum)
        let dbCoursesGeneral = mongoose.connection.collection("courses_general"); // get MongoDB collection
        // get cursor of courses from database with queried course number
        let cursorCourseNum = 
            dbCoursesGeneral.find({"course_num": {"$regex": '^' + reqCourseNum}});
        let cursorCourseNumCleaned = 
            dbCoursesGeneral.find({"course_num": {"$regex": '^' + cleanCourseNum(reqCourseNum)}});
        let cursorCourseTitle = 
            dbCoursesGeneral.find({ "course_title": { "$regex": reqCourseNum, "$options": "i"} });
        let termCourseIdMap = {}; // map unique courses from both cnum and cleaned cnum
        
        if (queryMatch == "courseNum")
        {
            // match user input with general courses' course num
            await cursorCourseNum.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
        }
        else if (queryMatch == "courseTitle")
        {
            // match user input with general courses' course title
            await cursorCourseTitle.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
            // match cleaned user input with general courses' course title
            await cursorCourseNumCleaned.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
        }
        else if (queryMatch == "matchAll")
        {
            // match user input with general courses' course num
            await cursorCourseNum.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
            // match user input with general courses' course title
            await cursorCourseTitle.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
            // match cleaned user input with general courses' course title
            await cursorCourseNumCleaned.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "gen_course_id" : doc["_id"].valueOf(),
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"]
                };
                termCourseIdMap[doc["_id"].valueOf()] = docToInsert;
            });
        }

        // get course documents array
        let documents = [];
        for (currTermCourseId in termCourseIdMap) {
            let currCourseDoc = termCourseIdMap[currTermCourseId];
            documents.push(currCourseDoc);
        }

        // sort array by course num
        documents.sort((docA, docB) => {
            if (docA.course_num < docB.course_num) {
                return -1;
            } else if (docA.course_num > docB.course_num) {
                return 1;
            } else {
                return 0;
            }
        });

        // send response
        res.json({
            courses: documents,
            time_taken: (Date.now() - start).toString() + "ms"
        });
    }
}

exports.getTermCourses = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    
    // let queryMatch = req.query.match_method; // get desired matching method
    // // if no match method specified, set to matchAll as default
    // if (queryMatch === "") 
    // {
    //     queryMatch = "matchAll"; 
    // }
    
    // get query strings
    let reqCourseInput = req.query.cnum.toUpperCase();
    
    let reqAttr      = req.query.attr;
    let dbCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    // Check if both inputs are empty
    if ( reqCourseInput === "" && reqAttr === "" ) {
        /* no parameters are provided */

        // if no query string, return empty array
        res.json({courses: []});
        // send every courses
        // cursorCourseNum = dbCourses.find().sort({"course_num": 1});
    }
    else {
        /* some parameters are provided */

        if ( reqCourseInput === "" ) {
            /* only attribute is provided */
            let cursorAttributes = 
                dbCourses.find({"attributes": {"$all": [reqAttr]}}).sort({"course_num": 1});

            let documents = [];
            await cursorAttributes.forEach((doc) => {
                // parse database document
                let docToInsert = {
                    "term_course_id": doc["term_course_id"],
                    "course_num"    : doc["course_num"],
                    "course_title"  : doc["course_title"],
                    "units_esti"    : doc["units_esti"],
                    "attributes"    : doc["attributes"],
                    "closed"        : doc["closed"],
                    "is_virtual"    : doc["is_virtual"],
                    "description"    : doc["description"],
                    "last_term"     : doc["last_term"]
                };
                documents.push(docToInsert);
            });
            // send response
            res.json({
                courses: documents,
                time_taken: (Date.now() - start).toString() + "ms"
            });

        }
        else if ( reqAttr === "" ) {
            /* only reqCourseInput is provided */

            // query courses in database by course num or course title based on queryMatch
            if (queryMatch == "courseTitle") 
            {
                let cursorCourseTitle = 
                    dbCourses.find({ "course_title": { "$regex": reqCourseInput, "$options": "i"} });
                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course title cursor
                await cursorCourseTitle.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            else if (queryMatch == "courseNum")
            {
                let cursorCourseNum = 
                    dbCourses.find({ "course_num": { "$regex": '^' + reqCourseInput } });
                let cursorCourseNumCleaned =
                    dbCourses.find({ "course_num": { "$regex": '^' + cleanCourseNum(reqCourseInput) } });
                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course num cursor
                await cursorCourseNum.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course num cursor
                await cursorCourseNumCleaned.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            else if (queryMatch == "matchAll")
            {
                // query courses in database by course num and course title
                let cursorCourseNum = 
                    dbCourses.find({ "course_num": { "$regex": '^' + reqCourseInput } });
                let cursorCourseNumCleaned =
                    dbCourses.find({ "course_num": { "$regex": '^' + cleanCourseNum(reqCourseInput) } });
                let cursorCourseTitle = 
                    dbCourses.find({ "course_title": { "$regex": reqCourseInput, "$options": "i"} });

                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course num cursor
                await cursorCourseNum.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course num cursor
                await cursorCourseNumCleaned.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course title cursor
                await cursorCourseTitle.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            
            // get course documents array
            let documents = [];
            for (currTermCourseId in termCourseIdMap) {
                let currCourseDoc = termCourseIdMap[currTermCourseId];
                documents.push(currCourseDoc);
            }

            // sort array by course num
            documents.sort((docA, docB) => {
                if (docA.course_num < docB.course_num) {
                    return -1;
                } else if (docA.course_num > docB.course_num) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // send response
            res.json({
                courses: documents,
                time_taken: (Date.now() - start).toString() + "ms"
            });

        }
        else {
            /* all parameters are provided */
            if (queryMatch == "courseNum")
            {
                // get cursor matching user input with course num and attr
                let cursorCourseNumAttr = dbCourses.find({
                    "course_num": {
                        "$regex": '^' + reqCourseInput
                    },
                    "attributes": {
                        "$all": [reqAttr]
                    }
                });
                let cursorCourseNumCleanedAttr = dbCourses.find({ 
                    "course_num": { 
                        "$regex": '^' + cleanCourseNum(reqCourseInput) 
                    },
                    "attributes": {
                        "$all": [reqAttr]
                }});
                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course num cursor
                await cursorCourseNumAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course num cursor
                await cursorCourseNumCleanedAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            else if (queryMatch == "courseTitle")
            {
                // get cursor matching user input with course title and attr
                let cursorCourseTitleAttr = dbCourses.find({
                    "course_title": { 
                        "$regex": reqCourseInput, 
                        "$options": "i"
                    },
                    "attributes": {
                        "$all": [reqAttr]
                    }
                });
                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course title cursor
                await cursorCourseTitleAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            else if (queryMatch == "matchAll")
            {
                // get cursor matching user input with course num and attr
                let cursorCourseNumAttr = dbCourses.find({
                    "course_num": {
                        "$regex": '^' + reqCourseInput
                    },
                    "attributes": {
                        "$all": [reqAttr]
                    }
                });
                let cursorCourseNumCleanedAttr = dbCourses.find({ 
                    "course_num": { 
                        "$regex": '^' + cleanCourseNum(reqCourseInput) 
                    },
                    "attributes": {
                        "$all": [reqAttr]
                }});
                // get cursor matching user input with course title and attr
                let cursorCourseTitleAttr = dbCourses.find({
                    "course_title": { 
                        "$regex": reqCourseInput, 
                        "$options": "i"
                    },
                    "attributes": {
                        "$all": [reqAttr]
                    }
                });

                let termCourseIdMap = {}; // map unique courses from both cnum and ctitle cursors
                // map term course id to a course document from the course num cursor
                await cursorCourseNumAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course num cursor
                await cursorCourseNumCleanedAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
                // map term course id to a course document from the course title cursor
                await cursorCourseTitleAttr.forEach((doc) => {
                    // parse database document
                    let docToInsert = {
                        "term_course_id": doc["term_course_id"],
                        "course_num"    : doc["course_num"],
                        "course_title"  : doc["course_title"],
                        "units_esti"    : doc["units_esti"],
                        "attributes"    : doc["attributes"],
                        "closed"        : doc["closed"],
                        "is_virtual"    : doc["is_virtual"],
                        "description"    : doc["description"],
                        "last_term"     : doc["last_term"]
                    };
                    termCourseIdMap[doc["term_course_id"]] = docToInsert;
                });
            }
            
            // get course documents array
            let documents = [];
            for (currTermCourseId in termCourseIdMap) {
                let currCourseDoc = termCourseIdMap[currTermCourseId];
                documents.push(currCourseDoc);
            }

            // sort array by course num
            documents.sort((docA, docB) => {
                if (docA.course_num < docB.course_num) {
                    return -1;
                } else if (docA.course_num > docB.course_num) {
                    return 1;
                } else {
                    return 0;
                }
            });

            // send response
            res.json({
                courses: documents,
                time_taken: (Date.now() - start).toString() + "ms"
            });
        }
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

////////////////////////////////////////
//                                    //
//         Private Functions          //
//                                    //
////////////////////////////////////////
const cleanCourseNum = (courseNum) => {
    let numDigits = 0;
    let numDigitsAfterLastDash = 0;
    let numDashes = 0;
    let indexOfLastDash = 0;
    let indexOfLastNonDigit = 0;
    for (let i = 0; i < courseNum.length; i++) {
        let currCharStr = courseNum[i];
        if (currCharStr.charCodeAt(0) >= 48 && 
            currCharStr.charCodeAt(0) <= 57) {
            /* currCharStr is a digit */
            numDigits++;
            if (numDashes > 0) {
                /* a dash was previously found */
                numDigitsAfterLastDash++;
            }
        } else if (currCharStr == '-') {
            /* currCharStr is a dash */
            indexOfLastDash = i;
            indexOfLastNonDigit = i;
            numDashes++;
            numDigitsAfterLastDash = 0;
        } else {
            /* currCharStr is not a digit or a dash */
            indexOfLastNonDigit = i;
        }
    }
    let finalStr;
    if (numDigitsAfterLastDash < 4 && numDigitsAfterLastDash > 0) {
        /* Cases: CS-15, CS-015, CS-0015, CS-0200, CS-200*/
        let numZeroesToAdd = 4 - numDigitsAfterLastDash;
        let strToAdd = "";
        for (let i = 0; i < numZeroesToAdd; i++)
            strToAdd += "0";
        let strFirstPart = courseNum.substring(0, indexOfLastDash + 1);
        let strLastPart = courseNum.substring(indexOfLastDash + 1, courseNum.length);
        finalStr = strFirstPart + strToAdd + strLastPart;
    } else if (numDigitsAfterLastDash == 0) {
        /* Cases: CS15, CS015, CS0015, CS200, CS-*/
        let numZeroesToAdd = 4 - numDigits;
        if (numDashes == 0) {
            /* no dash found */
            let strToAdd = "-";
            for (let i = 0; i < numZeroesToAdd; i++)
                strToAdd += "0";
            let strFirstPart = courseNum.substring(0, indexOfLastNonDigit + 1);
            let strLastPart = courseNum.substring(indexOfLastNonDigit + 1, courseNum.length);
            finalStr = strFirstPart + strToAdd + strLastPart;
        } else {
            /* dash(es) found but no digits afterwards */
            let strToAdd = "";
            for (let i = 0; i < numZeroesToAdd; i++)
                strToAdd += "0";
            let strFirstPart = courseNum.substring(0, indexOfLastDash + 1);
            finalStr = strFirstPart + strToAdd;
        }
    } else {
        finalStr = courseNum;
    }
    return finalStr;
}
