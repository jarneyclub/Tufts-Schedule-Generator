// const generate = require('../services/generateCourseScheduleV2/generateCourseSchedule.js');
const coursesTermHandler = require('../services/handlers/coursesTerm.js');
const scheduleHandler = require('../services/handlers/schedule.js');
const CourseSchedule = require('../services/generateCourseSchedule/generateCourseSchedule.js');
const resHandler = require("./utils/resHandler.js");
const Section = require('../models/internal/objects/classes/Section.js');
const Course = require('../models/internal/objects/classes/Course.js');
const Class = require('../models/internal/objects/classes/Class.js');
/**
 * POST /schedule
 * 
 * @param {*} req
 * @param {*} res
 */
exports.generateSchedule = async (req, res) => {
    try {
        const {sched_name, term_course_ids, filter} = req.body;
        // validate types
        if (typeof sched_name !== "string") 
            throw {id: "602", status: "400", title: "Schedule Error", detail : "Schedule name is not a string"};
        var start = Date.now(); // begin timing API endpoint
        let startDB = Date.now(); // start timer
        // get Section documents from database
        let arrCourses = []; // array with Course objects
        for (let i = 0; i < term_course_ids.length; i++) {
            let currTermCourseId = term_course_ids[i];
            let arrSections = 
                await coursesTermHandler.getSectionsForSingleCourse(currTermCourseId);
            let mapSecTypeToSectionMap = {}; // e.g.{'Lecture': {0: Section...}}
            let mapSecTypeToUnits = {}; // e.g.{'Lecture': 5}
            let courseNum;
            let courseTitle;
            for (let j = 0; j < arrSections.length; j++) {
                // mapping of raw section status to more readable format
                let mapStatusFormat = {
                    "O": "open",
                    "C": "closed",
                    "W": "waitlist" };
                // parse section information
                let currSection      = arrSections[j];
                courseNum            = currSection.course_num;
                courseTitle          = currSection.course_title;
                let sectionId        = currSection._id;
                let sectionUnits     = currSection.units;
                let sectionNum       = currSection.section_num;
                let sectionStatus    = mapStatusFormat[currSection.status];
                let sectionType      = currSection.section_type;
                let sectionInstrMode = currSection.instr_mode;
                
                // log units of this section type
                mapSecTypeToUnits[sectionType] = sectionUnits;

                let mapClassObj = {}; // map of index to Class objects of this section
                let mapClassObjIndex = 0;
                for (let k = 0; k < currSection.classes.length; k++) {
                    let currClass = currSection.classes[k];
                    let classInstructor = currClass.instructor;
                    let classRoom = currClass.room;
                    let classCampus = currClass.campus;
                    let classStartTime = currClass.start_time;
                    let classEndTime = currClass.end_time;
                    let classDayOfWeek = currClass.day_of_week;
                    let currClassObj = 
                        new Class(courseNum, courseTitle, sectionNum, sectionType, 
                                    classDayOfWeek, classStartTime, classEndTime, 
                                    classRoom, classCampus, classInstructor);
                    mapClassObj[mapClassObjIndex] = currClassObj;
                    mapClassObjIndex++;
                } // (End of) iteration through classes
                let currSectionObj = 
                    new Section(courseNum, courseTitle, sectionNum, sectionType, mapClassObj, sectionStatus, sectionId);
                
                // append section object to mapSecTypeToSectionMap
                if (mapSecTypeToSectionMap[sectionType] === undefined)
                    mapSecTypeToSectionMap[sectionType] = {'0': currSectionObj};
                else {
                    mapSecTypeToSectionMap[sectionType]
                        [Object.keys(mapSecTypeToSectionMap[sectionType]).length] = currSectionObj;
                }
            } // (End of) iteration through sections
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            let currCourseObj = 
                new Course(courseNum, courseTitle, Object.keys(mapSecTypeToSectionMap), 
                            mapSecTypeToSectionMap, Object.values(mapSecTypeToUnits).reduce(reducer), currTermCourseId);
            arrCourses.push(currCourseObj);
        } // (End of) iteration through courses
        console.log("(api/schedule): ", "Processing sections from the database took ", (Date.now()- startDB).toString() + "ms");
        CourseSchedule.generateCourseSchedule(arrCourses, filter)
        .then(
            async (weeklySchedule) => {
                arrCoursesInfoToReturn = [];
                for (let i = 0; i < arrCourses.length; i++) {
                    let courseInfo = {};
                    courseInfo.term_course_id = arrCourses[i].getCourseDatabaseId();
                    courseInfo.course_num = arrCourses[i].getCourseID();
                    courseInfo.course_title = arrCourses[i].getCourseName();
                    courseInfo.units_esti = arrCourses[i].getUnits();
                    arrCoursesInfoToReturn.push(courseInfo);
                }
                let createdSchedule = 
                    await scheduleHandler.createSchedule(req.userid, sched_name, filter, 9999, arrCoursesInfoToReturn, weeklySchedule.data);
                let response = {
                    data: createdSchedule,
                    time_taken: (Date.now() - start).toString() + "ms"
                }
                res.json(response);
            },
            (error) => {
                let response = {
                    error: error,
                    time_taken: (Date.now() - start).toString() + "ms"
                };
                res.status(400);
                res.json(response)
            }
        )
    }
    catch(err) {
        errorHandler(err, "generateSchedule", res);
    }
}

/**
 * PATCH /schedule
 * @param {*} req
 * @param {*} res
 */
exports.generateAndChangeSchedule = async (req, res) => {
    try {
        const {sched_id, term_course_ids, filter} = req.body;
        // validate types
        if (typeof sched_name !== "string") 
            throw {id: "602", status: "400", title: "Schedule Error", detail : "Schedule name is not a string"};
        var start = Date.now(); // begin timing API endpoint
        let startDB = Date.now(); // start timer
        // get Section documents from database
        let arrCourses = []; // array with Course objects
        for (let i = 0; i < term_course_ids.length; i++) {
            let currTermCourseId = term_course_ids[i];
            let arrSections = 
                await coursesTermHandler.getSectionsForSingleCourse(currTermCourseId);
            let mapSecTypeToSectionMap = {}; // e.g.{'Lecture': {0: Section...}}
            let mapSecTypeToUnits = {}; // e.g.{'Lecture': 5}
            let courseNum;
            let courseTitle;
            for (let j = 0; j < arrSections.length; j++) {
                // mapping of raw section status to more readable format
                let mapStatusFormat = {
                    "O": "open",
                    "C": "closed",
                    "W": "waitlist" };
                // parse section information
                let currSection      = arrSections[j];
                courseNum            = currSection.course_num;
                courseTitle          = currSection.course_title;
                let sectionId        = currSection._id;
                let sectionUnits     = currSection.units;
                let sectionNum       = currSection.section_num;
                let sectionStatus    = mapStatusFormat[currSection.status];
                let sectionType      = currSection.section_type;
                let sectionInstrMode = currSection.instr_mode;
                
                // log units of this section type
                mapSecTypeToUnits[sectionType] = sectionUnits;

                let mapClassObj = {}; // map of index to Class objects of this section
                let mapClassObjIndex = 0;
                for (let k = 0; k < currSection.classes.length; k++) {
                    let currClass = currSection.classes[k];
                    let classInstructor = currClass.instructor;
                    let classRoom = currClass.room;
                    let classCampus = currClass.campus;
                    let classStartTime = currClass.start_time;
                    let classEndTime = currClass.end_time;
                    let classDayOfWeek = currClass.day_of_week;
                    let currClassObj = 
                        new Class(courseNum, courseTitle, sectionNum, sectionType, 
                                    classDayOfWeek, classStartTime, classEndTime, 
                                    classRoom, classCampus, classInstructor);
                    mapClassObj[mapClassObjIndex] = currClassObj;
                    mapClassObjIndex++;
                } // (End of) iteration through classes
                let currSectionObj = 
                    new Section(courseNum, courseTitle, sectionNum, sectionType, mapClassObj, sectionStatus, sectionId);
                
                // append section object to mapSecTypeToSectionMap
                if (mapSecTypeToSectionMap[sectionType] === undefined)
                    mapSecTypeToSectionMap[sectionType] = {'0': currSectionObj};
                else {
                    mapSecTypeToSectionMap[sectionType]
                        [Object.keys(mapSecTypeToSectionMap[sectionType]).length] = currSectionObj;
                }
            } // (End of) iteration through sections
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            let currCourseObj = 
                new Course(courseNum, courseTitle, Object.keys(mapSecTypeToSectionMap), 
                            mapSecTypeToSectionMap, Object.values(mapSecTypeToUnits).reduce(reducer), currTermCourseId);
            arrCourses.push(currCourseObj);
        } // (End of) iteration through courses
        console.log("(api/schedule): ", "Processing sections from the database took ", (Date.now()- startDB).toString() + "ms");
        CourseSchedule.generateCourseSchedule(arrCourses, filter)
        .then(
            async (weeklySchedule) => {
                arrCoursesInfoToReturn = [];
                for (let i = 0; i < arrCourses.length; i++) {
                    let courseInfo = {};
                    courseInfo.term_course_id = arrCourses[i].getCourseDatabaseId();
                    courseInfo.course_num = arrCourses[i].getCourseID();
                    courseInfo.course_title = arrCourses[i].getCourseName();
                    courseInfo.units_esti = arrCourses[i].getUnits();
                    arrCoursesInfoToReturn.push(courseInfo);
                }
                let createdSchedule = 
                    await scheduleHandler.updateSchedule(sched_id, filter, arrCoursesInfoToReturn, weeklySchedule.data);
                let response = {
                    data: createdSchedule,
                    time_taken: (Date.now() - start).toString() + "ms"
                }
                res.json(response);
            },
            (error) => {
                let response = {
                    error: error,
                    time_taken: (Date.now() - start).toString() + "ms"
                };
                res.status(400);
                res.json(response)
            }
        )
    }
    catch(err) {
        errorHandler(err, "generateSchedule", res);
    }
}

/**
 * GET /schedules
 * @param {*} req
 * @param {*} res
 */
exports.getSchedules = async (req, res) => {
    let userId = req.query.userId
    let schedules = await scheduleHandler.getSchedulesOfUser(userId);
    res.json({schedules: schedules});
}

const errorHandler = (err, endpoint, res) => {
    console.error("(degreeReqController/errorhandler) err: ", err);
    if (err.detail !== undefined && err.title != undefined) {
        /* this is internally formatted error */
        resHandler.respondWithCustomError(err.id, err.status, err.title, err.detail, res);
    }
    else {
        console.error("(degreeReqController/" + endpoint, err);
        resHandler.respondWithCustomError("000", "500", "Internal Server Error", err, res);
    }
}

