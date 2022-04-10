/*
* parseSectionIdsInSchedule.js
* Purpose: 
*      o retrieve 
*      The respective class information for that Section reference on 
*      a given day of the week
*
*
*
* Example: 
*       sections: [ {term_section_id}, {term_section_id}, {...} ]
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

const Section = require('../../models/internal/objects/classes/Section.js');
const getSection = require('../../services/handlers/coursesTerm.js');
const Class = require('../../models/internal/objects/classes/Class.js');
const timeUtils = require("./utils/timeUtils.js");

/*Not finished!*/
exports.sectionsToEvents = async(sections) => {
    let events = {
        "Monday": [], 
        "Tuesday": [], 
        "Wednesday": [], 
        "Thursday": [], 
        "Friday": [], 
        "TimeUnspecified": []
    };
    
    for (let i = 0; i < sections.length; i++) {
        let sectionObject = await getSection.getSectionObject(sections[i]);
        
        let classes = sectionObject.getClasses();

        for (let i in classes) {
            let classObject = classes[i];
            let eventObject = getEventObjectFromClass(classObject);
            events[classObject.getDayOfWeekString()].push(eventObject);
        }
    }

    return events;
}

const getEventObjectFromClass = (classObject) => {
    
    let dayOfWeek = classObject.getDayOfWeekString();
    
    let room = classObject.getLocation();
    let city = classObject.getCity();
    let eventLocation = room + "," + city;
    
    let courseName = classObject.getCourseName();
    let courseId = classObject.getCourseID();
    let eventDetails = courseName + ", " + courseId;
    
    let eventName = classObject.getSectionName();
    let courseDatabaseId = classObject.getCourseDatabaseId();
    let sectionId = classObject.getSectionID();
    let instructors = classObject.getInstructors();
    
    let time_start = timeUtils.integerToMilitaryTime(classObject.getStartTime());
    let time_end = timeUtils.integerToMilitaryTime(classObject.getEndTime());
    
    let eventObject = {
        details: eventDetails,
        location: eventLocation,
        name: eventName,
        time_start: time_start,
        time_end: time_end,
        term_course_id: courseDatabaseId,
        term_section_id: sectionId,
        instructors: instructors
    }
    
    return eventObject;
}

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