/*
* Name: scheduleController.js
* API endpoints implementation for schedule related operations
*/

// const generate = require('../services/generateCourseScheduleV2/generateCourseSchedule.js');
const coursesTermHandler = require('../services/handlers/coursesTerm.js');
const scheduleHandler = require('../services/handlers/schedule.js');
const analyticsHandler = require('../services/handlers/analytics.js');
const sectionIdParser = require('../services/generateCourseSchedule/parseSectionIdsInSchedule.js');
const CourseSchedule = require('../services/generateCourseSchedule/generateCourseSchedule.js');
const errorHandler = require("./utils/controllerErrorHandler.js").getErrorHandler("scheduleController");

/**
 * POST /schedule
 * @param {*} req
 * @param {*} res
 */
exports.makeEmptySchedule = async (req, res) => {
    try {
        const {sched_name} = req.body;

        var start = Date.now(); // begin timing API endpoint
        let createdSchedule =
            await scheduleHandler.createSchedule(req.userid, sched_name, undefined, "2222", undefined, undefined);
        let response = {
            data: createdSchedule,
            time_taken: (Date.now() - start).toString() + "ms"
        }

        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "makeEmptySchedule");
        }
        
        // send response
        res.json(response);
    } catch (err) {
        errorHandler(err, "makeEmptySchedule", res, req.userid, req.role);
    }
}

/**
 * PATCH /schedule
 * @param {*} req
 * @param {*} res
 */
exports.updateSchedule = async (req, res) => {
    try {
        const {sched_id, term_course_ids, filter} = req.body;
        // save activity if not developer
            if (req.role !== "developer") 
                analyticsHandler.saveApiUse(req.userid, "updateSchedule");
        // validate types
        if (typeof sched_id !== "string") 
            throw {id: "602", status: "400", title: "Schedule Error", detail : "Schedule ID is not a string"};

        var start = Date.now(); // begin timing API endpoint
        let startDB = Date.now(); // start timer
        
        // Get information of courses that the user requested
        let arrCourses = []; // array with Course objects
        for (let i = 0; i < term_course_ids.length; i++) {
            let courseObject = await coursesTermHandler.getCourseObject(term_course_ids[i]);
            arrCourses.push(courseObject);
        }

        console.log("(scheduleCntrl/generateAndChangeSchedule): ", "Processing sections from the database took ", (Date.now()- startDB).toString() + "ms");
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
                /* update schedule on database */
                let createdSchedule = 
                    await scheduleHandler.updateSchedule(sched_id, filter, arrCoursesInfoToReturn, weeklySchedule);

                // save activity if user is not developer
                if (req.role !== "developer") {
                    analyticsHandler.saveApiUse(req.userid, "updateSchedule");
                }
                
                // send response
                let response = {
                    data: createdSchedule,
                    time_taken: (Date.now() - start).toString() + "ms"
                }
                res.json(response);
            },
            (error) => {
                console.log("(scheduleController/updateSchedule) ERROR: ", error);
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
        errorHandler(err, "generateSchedule", res, req.userid, req.role);
    }
}

/**
 * GET /schedules
 * @param {*} req
 * @param {*} res
 */
exports.getSchedules = async (req, res) => {
    try {
        let userId = req.userid;
        /*Array of schedule documents where each DOW event is a Section Id*/
        let schedules = await scheduleHandler.getSchedulesOfUser(userId);
        
        /*Array of schedule documents where each DOW event has proper attributes*/
        //let refined_schedules = await sectionIdParser.parseSectionIdsInSchedule(schedules);
            
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "getSchedules");
        }

        res.json({schedules: schedules});
    }
    catch (err) {
        errorHandler(err, "getSchedules", res, req.userid, req.role);
    }
}

/**
 * PATCH /schedule/name
 * @param {*} req
 * @param {*} res
 */
exports.changeScheduleName = async (req, res) => {
    try {
        let {sched_id, new_name} = req.body;
        let newSchedule = await scheduleHandler.changeScheduleName(sched_id, new_name);

        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "changeScheduleName");
        }
        
        res.json({schedule: newSchedule});
    }
    catch (err) {
        errorHandler(err, "changeScheduleName", res, req.userid, req.role);
    }

}

exports.deleteSchedule = async (req, res) => {
    try {
        let {sched_id} = req.body;
        console.log("(deleteSchedule) req.body: ", req.body);
        await scheduleHandler.deleteSchedule(sched_id);

        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "deleteSchedule");
        }

        res.json({"res": "Schedule deleted"});
    }
    catch (err) {
        errorHandler(err, "deleteSchedule", res, req.userid, req.role);
    }
}

