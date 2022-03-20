/*
* Name: schedule.js
* Functions for getting/putting database information about schedules
*/

const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');

/*Pam changes here*/
exports.createSchedule   = async (userId, scheduleName, filter, term, courses, classes) => {   
    try {
        if (filter == undefined) {
            let     allDayTimePref = [
                {
                    "time_earliest": "08:00",
                    "time_latest": "08:30"
                },
                {
                    "time_earliest": "08:30",
                    "time_latest": "09:00"
                },
                {
                    "time_earliest": "09:00",
                    "time_latest": "09:30"
                },
                {
                    "time_earliest": "09:30",
                    "time_latest": "10:00"
                },
                {
                    "time_earliest": "10:00",
                    "time_latest": "10:30"
                },
                {
                    "time_earliest": "10:30",
                    "time_latest": "11:00"
                },
                {
                    "time_earliest": "11:00",
                    "time_latest": "11:30"
                },
                {
                    "time_earliest": "11:30",
                    "time_latest": "12:00"
                },
                {
                    "time_earliest": "12:00",
                    "time_latest": "12:30"
                },
                {
                    "time_earliest": "12:30",
                    "time_latest": "13:00"
                },
                {
                    "time_earliest": "13:00",
                    "time_latest": "13:30"
                },
                {
                    "time_earliest": "13:30",
                    "time_latest": "14:00"
                },
                {
                    "time_earliest": "14:00",
                    "time_latest": "14:30"
                },
                {
                    "time_earliest": "14:30",
                    "time_latest": "15:00"
                },
                {
                    "time_earliest": "15:00",
                    "time_latest": "15:30"
                },
                {
                    "time_earliest": "15:30",
                    "time_latest": "16:00"
                },
                {
                    "time_earliest": "16:00",
                    "time_latest": "16:30"
                },
                {
                    "time_earliest": "16:30",
                    "time_latest": "17:00"
                },
                {
                    "time_earliest": "17:00",
                    "time_latest": "17:30"
                },
                {
                    "time_earliest": "17:30",
                    "time_latest": "18:00"
                },
                {
                    "time_earliest": "18:00",
                    "time_latest": "18:30"
                },
                {
                    "time_earliest": "18:30",
                    "time_latest": "19:00"
                },
                {
                    "time_earliest": "19:00",
                    "time_latest": "19:30"
                },
                {
                    "time_earliest": "19:30",
                    "time_latest": "20:00"
                },
                {
                    "time_earliest": "20:00",
                    "time_latest": "20:30"
                },
                {
                    "time_earliest": "20:30",
                    "time_latest": "21:00"
                }, 
                {
                    "time_earliest": "21:00",
                    "time_latest": "21:30"
                }, 
                {
                    "time_earliest": "21:30",
                    "time_latest": "22:00"
                }
            ];
            filter = {
                "misc": {
                    "ignoreTU": false,
                    "ignoreM": false,
                    "ignoreClosed": false,
                    "ignoreWL": false
                    },
                "time": {
                    "Monday": allDayTimePref,
                    "Tuesday": allDayTimePref,
                    "Wednesday": allDayTimePref,
                    "Thursday": allDayTimePref,
                    "Friday": allDayTimePref
                }
            };
        }
        if (courses == undefined)
            courses = [];
        if (classes == undefined)
            classes = {};
        
        let schedule = new Schedule({
            sched_name: scheduleName,
            user_id: userId,
            filter: filter,
            events: classes, /*Pam change here for if classes are defined */
            courses: courses,
            term: term
        });

        let insertedSchedule = await schedule.save();
        return {
            sched_id   : insertedSchedule._id.valueOf(),
            sched_name : scheduleName,
            user_id    : userId,
            filter     : filter,
            classes    : classes,
            courses    : courses,
            term       : term
        }
    } catch (e) {
        errorHandler(e, "createSchedule");
    }
}
/*Pam changes here
If updateSchedule takes in a new parameter, new schema item*/
exports.updateSchedule = async (id, filter, courses, classes) => {
    try {
        // TODO no schedule with given id was found
        // console.log("(schedule/updateSchedule) filter: ", filter);
        console.log("(schedule/updateSchedule) courses: ", courses);
        console.log("(schedule/updateSchedule) classes: ", classes);
        // update schedule 
        let newSchedule = await Schedule.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(id)
        }, {
            filter     : filter,
            courses    : courses,
            events     : classes /*Pam change here*/
        }, {
            new: true,
            upsert: false
        });

        return {
            sched_id   : newSchedule._id.valueOf(),
            sched_name : newSchedule.sched_name,
            user_id    : newSchedule.user_id,
            filter     : newSchedule.filter,
            classes    : newSchedule.events,
            courses    : newSchedule.courses,
            term       : newSchedule.term
        }
    } catch (e) {
        errorHandler(e, "updateSchedule");
    }
}

exports.changeScheduleName = async (id, newName) => {
    // TODO no schedule with given id was found
    // update schedule 
    try {
        let newSchedule = await Schedule.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(id)
        }, {
            sched_name    : newName
        }, {
            new: true,
            upsert: false
        });
    
        return {
            sched_id   : newSchedule._id.valueOf(),
            sched_name : newSchedule.sched_name,
            user_id    : newSchedule.user_id,
            filter     : newSchedule.filter,
            classes    : newSchedule.events,
            courses    : newSchedule.courses,
            term       : newSchedule.term
        }
    } catch (e) {
        errorHandler(e, "changeScheduleName");
    }
}
/*Gets schedule of user from database with section database ids instead of sections arrays*/
exports.getSchedulesOfUser = async (userId) => {
    try {
        let scheduleCollection = mongoose.connection.collection("schedules"); // get MongoDB collection
        let cursor = scheduleCollection.find({
            user_id: userId
        });
        // convert cursor to array
        let documents = [];
        /*Each doc is a schedule document*/
        await cursor.forEach((doc) => {
            // parse degree requirement
            let docParsed = {
                sched_id   : doc._id.valueOf(),
                sched_name : doc.sched_name,
                filter     : doc.filter,
                term       : doc.term,
                courses    : doc.courses,
                //change here...
                //for each DOW array, populate 'sections'
                classes    : doc.events
            };
            documents.push(docParsed);
        });
    
        return documents
    } catch (e) {
        errorHandler(e, "getSchedulesOfUser");
    }

}

exports.deleteSchedule = async (id) => {
    try {
        let scheduleCollection = mongoose.connection.collection("schedules"); // get MongoDB collection
        console.log("(deleteSchedule) id: ", id);
        await scheduleCollection.deleteOne({_id: mongoose.Types.ObjectId(id)});
        return true;   
    } catch (e) {
        errorHandler(e, "deleteSchedule");
    }
}

const errorHandler = (e, functionName) => {
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Schedule Error (" + functionName + ")" , detail: e.message };
        }
        else if (e.message.indexOf("No Schedule") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Schedule Error (" + functionName + ")", detail: e.message };
        }
        else {
            throw { id: "000", status: "500", title: "Schedule Error (" + functionName + ")", detail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
        else {
            throw { id: "000", status: "500", title: "Schedule Error (" + functionName + ")", detail: e.message };
        }
    }
}
