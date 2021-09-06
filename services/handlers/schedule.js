const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');

exports.createSchedule = async (userId, scheduleName, filter, term, courses, classes) => {   
    let schedule = new Schedule({
        sched_name: scheduleName,
        user_id: userId,
        filter: filter,
        events: classes,
        courses: courses,
        term: term
    });
    let insertedSchedule = await schedule.save();
    return {
        sched_id   : insertedSchedule._id.valueOf(),
        sched_name : scheduleName,
        user_id    : userId,
        filter     : filter,
        events     : classes,
        courses    : courses,
        term       : term
    }
}

exports.updateSchedule = async (id, filter, courses, classes) => {
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
}

exports.updateScheduleName = async (id, name) => {
    // update schedule 
    let newSchedule = await Schedule.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(id)
    }, {
        sched_name    : name
    }, {
        new: true,
        upsert: false
    });
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