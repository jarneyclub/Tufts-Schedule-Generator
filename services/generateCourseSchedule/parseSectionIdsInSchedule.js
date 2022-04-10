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
const Class = require('../../models/internal/objects/classes/Class.js');
const timeUtils = require("./utils/timeUtils.js");

/*Not finished!*/
exports.sectionsToEvents = async(sections) => {
    // let eventsParsed = {
    //     Monday:      [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
    //     Tuesday:     [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
    //     Wednesday:   [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
    //     Thursday:    [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
    //     Friday:      [{details: String, location: String, name: String, time_start: String, time_end: String, term_course_id: String, term_section_id: String, instructors: String}],
    //     TimeUnspecified: [{details: String, location: String, name: String, time_start: String, time_end: String, term_section_id: String, instructors: String}]
    // };
    
    
    let events = {
        "Monday": [], 
        "Tuesday": [], 
        "Wednesday": [], 
        "Thursday": [], 
        "Friday": [], 
        "TimeUnspecified": []
    };
    
    
    /*Use function getSectionObject 
        For each Section Object, call 
                Let classes = section.getClasses()
                
        For (let classObject in classes) {
            do something with classObject
        }
        
        events[classObject.getDayOfWeekString()]
    }*/
        
        for (let i = 0; i < sections.length; i++) {
            let sectionObject = getSectionObject(sections[i]);
            console.log("Created a section Object: \n");
            console.log(sectionObject);
            let classes = sectionObject.getClasses();
            console.log("Got classes array: \n")
            console.log(classes);
            
            
            for (let classObject in classes) {
                let dayOfWeek = classObject.getDayOfWeek();
                console.log("This is the day of week \n");
                console.log(dayOfWeek);
                
                let room = courseObject.getLocation();
                let city = courseObject.getCity();
                let eventLocation = room + "," + city;
                
                let courseName = courseObject.getCourseName();
                let courseId = courseObject.getCourseID();
                let eventDetails = courseName + ", " + courseId;
                
                let eventName = courseObject.getSectionName();
                let courseDatabaseId = courseObject.getCourseDatabaseId();
                let sectionId = courseObject.getSectionID();
                let instructors = courseObject.getInstructors();
                
                let time_start = timeUtils.integerToMilitaryTime(courseObject.getStartTime());
                let time_end = timeUtils.integerToMilitaryTime(courseObject.getEndTime());
                
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
                console.log("Made an eventobject: \n");
                console.log(eventObject);
                
                events[dayOfWeek].push();
                
            }
        }
        
    console.log("Made Events Object: \n");
    console.log(events);
    
    return events;
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