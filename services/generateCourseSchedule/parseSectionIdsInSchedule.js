/*
* parseSectionIdsInSchedule.js
* Purpose: 
*      To parse through a given array of user schedules, where the events 
*      attribute, for each day of the week, references a Section Database 
*      Id. 
*      For each Section Database Id referenced per class, to retrieve 
*      The respective class information for that Section reference on 
*      a given day of the week
*
*
*
* Example: 
*       events: {
*           Monday: [{SectionDatabaseId},{SectionDatabaseId}],
*           Tuesday: [{SectionDatabaseId},{SectionDatabaseId}],
*           Wednesday: [{SectionDatabaseId}],
*           Thursday: [{SectionDatabaseId}].
*           Friday: [],
*           TimeUnspecified: []
*        },
*
* Convert to:
*       events: {
*           Monday: [{details: String, 
*                     location: String, 
*                     name: String, 
*                     time_start: String, 
*                     time_end: String, 
*                     term_course_id: String, 
*                     term_section_id: String, 
*                     instructors: String}, 
*                    {details: String, 
*                     location: String, 
*                     name: String, 
*                     time_start: String, 
*                     time_end: String, 
*                     term_course_id: String, 
*                     term_section_id: String, 
*                     instructors: String},],
*           Tuesday: [etc... ^]
*
* 
*/

const mongoose = require('mongoose');
const Section = mongoose.model('Section');
const ScheduleV2 = mongoose.model('ScheduleV2');

/*Not finished!*/
exports.parseSectionIdsInSchedule = async(schedules) => {
    try {
        
        for (int i = 0; i < schedules.length; i++) {
            schedules[i].populate('events');
        }
        
    } catch(e) {
        errorHandler(e, "parseSectionIdsInSchedule");
    }
    
    return schedules;
}

// const matchSectionIdsToSection = async (arrayEventsDayOfWeek) => {
//     try {
//         //get MongoDB Collection with Section documents
//         //let sectionsCollection = mongoose.connection.collection("sections");
//         populate('events')
// 
//     } catch(e) {
//         errorHandler(e, "matchSectionIdsToSection");
//     }
// }


/*help with errors??*/
const errorHandler = (e, functionName) => {
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Schedule Error (" + functionName + ")" , detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
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