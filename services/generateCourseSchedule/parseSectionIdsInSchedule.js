/*
* parseSectionIdsInSchedule.js
* Purpose: 
*     To convert an array of termSectionIds into an events Object 
*      of the section's classes in their respective days of the week arrays
* Date: April 9, 2022
*/

const Section = require('../../models/internal/objects/classes/Section.js');
const getSection = require('../../services/handlers/coursesTerm.js');
const Class = require('../../models/internal/objects/classes/Class.js');
const timeUtils = require("./utils/timeUtils.js");

/** Converts an array of termSectionIds into an events JSON with organized 
*   Classes in their corresponding days of the week
* @returns {object} {'Monday': [], 'Tuesday': []}
*/
exports.sectionsToEvents = async(sections) => {
    /*Initialize the events object to be returned to caller*/
    let events = {
        "Monday": [], 
        "Tuesday": [], 
        "Wednesday": [], 
        "Thursday": [], 
        "Friday": [], 
        "TimeUnspecified": []
    };
    
    /* Iterate through each term_ection_id in the array*/
    for (let i = 0; i < sections.length; i++) {
        /* Create a section object based on a given term_section_id */
        let sectionObject = await getSection.getSectionObject(sections[i]);
        
        let classes = sectionObject.getClasses(); /* Get all classes from Section object*/
        
        /* Iterate through classes and place in proper DayOfWeek in events object*/
        for (let i in classes) {
            let classObject = classes[i];
            /* Convert a class Object into desired event formatted details */
            let eventObject = getEventObjectFromClass(classObject);
            events[classObject.getDayOfWeekString()].push(eventObject); 
        }
    }

    return events;
}

/** Creates an "event" object in the proper formatting based on Class Object information
* @returns {object} {details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}
*/
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
    
    /* Initialize eventObject in desired formatting and populate with Class details*/
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