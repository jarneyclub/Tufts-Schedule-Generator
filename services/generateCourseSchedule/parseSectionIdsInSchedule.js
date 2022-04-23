/*
* parseSectionIdsInSchedule.js
* Purpose: 
*     To convert an array of termSectionIds into an events Object 
*      of the section's classes in their respective days of the week arrays
* Date Modified: April 23, 2022
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
    
    //not events, classes
    
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

/** Converts events object with DayOfWeek class arrays into an array of 
*   term section ids 
* @returns {array} {String} i.e testSectionsArray = ["83442","84108","84250"];
*
*/
exports.eventsToTermSectionIds = async(events) => {
    let termSectionIdsArray = [];
    
    /* For each day of the week in the events object, 
        get the term_section_id from every object in the array. 
    */
    
    // console.log("Now printing using .values:\n");
    // console.log(Object.values(events));
    
    // for (let dow in events) {
    //     console.log("IN FOR LOOP: ");
    //     console.log(dow);
    // 
    //        // for (let i = 0; i < dow.length; i++) {
    //        //       termSectionIdsArray.push(dow[i].term_section_id);
    //        //  }   
    // }
    Object.keys(events).forEach(function(key) {
        console.log("key: ");
        console.log(key);
        
       for (let i = 0; i < events[key].length; i++) {
           console.log("curr lenghth: ");
           console.log(events[key].length);
           
           console.log((events[key])[i]);
           
           console.log( ((events[key])[i]).term_section_id);
           termSectionIdsArray.push(events[key[i]].term_section_id);

       }
   });
    
    
    
    
    
    console.log(termSectionIdsArray);
    
    return termSectionIdsArray;
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