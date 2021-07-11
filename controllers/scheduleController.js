const generate = require('../services/generateCourseScheduleV2/generateCourseSchedule.js');
exports.generateSchedule = (req, res) => {
    const {sched_name, term_course_ids, filter} = req.body;
    generate(sched_name, term_course_ids, filter, res);
}