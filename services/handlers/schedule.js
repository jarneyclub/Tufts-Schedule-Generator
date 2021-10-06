const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');

exports.createSchedule   = async (userId, scheduleName, filter, term, courses, classes) => {   
    if (filter == undefined)
        filter = {};
    if  (courses == undefined)
        courses = [];
    if (classes == undefined)
        classes = {};
    
    let schedule = new Schedule({
        sched_name: scheduleName,
        user_id: userId,
        filter: filter,
        classes: classes,
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
}

exports.updateSchedule = async (id, filter, courses, classes) => {
    // TODO no schedule with given id was found

    // update schedule 
    let newSchedule = await Schedule.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(id)
    }, {
        filter     : filter,
        courses    : courses,
        classes    : classes
    }, {
        new: true,
        upsert: false
    });

    return {
        sched_id   : newSchedule._id.valueOf(),
        sched_name : newSchedule.sched_name,
        user_id    : newSchedule.user_id,
        filter     : newSchedule.filter,
        classes     : classes,
        courses    : newSchedule.courses,
        term       : newSchedule.term
    }
}

exports.updateScheduleName = async (id, newName) => {
    // TODO no schedule with given id was found
    // update schedule 
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
        classes     : classes,
        courses    : newSchedule.courses,
        term       : newSchedule.term
    }
}

exports.getSchedulesOfUser = async (userId) => {
    let scheduleCollection = mongoose.connection.collection("schedules"); // get MongoDB collection
    let cursor = scheduleCollection.find({
        user_id: userId
    });
    // convert cursor to array
    let documents = [];
    await cursor.forEach((doc) => {
        // parse degree requirement
        let docParsed = {
            sched_id   : doc._id.valueOf(),
            sched_name : doc.sched_name,
            filter     : doc.filter,
            term       : doc.term,
            courses    : doc.courses,
            classes    : doc.classes
        };
        documents.push(docParsed);
    });

    return documents

}