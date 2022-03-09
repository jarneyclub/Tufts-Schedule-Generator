/*
* Name: coursesTerm.js
* Functions for getting information from the database about courses, sections,
* and classes
*/
const mongoose = require('mongoose');
const Section = require('../../models/internal/objects/classes/Section.js');
const Course = require('../../models/internal/objects/classes/Course.js');
const Class = require('../../models/internal/objects/classes/Class.js');
/**
 * Create a Course object from information in the database.
 * @param {string} termCourseId
 * @return {Course} created Course object
 */
const getCourseObject = async (termCourseId) => {
    let arrSections = await getSectionsForSingleCourse(termCourseId);
    let mapSecTypeToSectionMap = {}; // e.g.{'Lecture': {0: Section...}}
    let mapSecTypeToUnits = {}; // e.g.{'Lecture': 5}
    for (let j = 0; j < arrSections.length; j++) {
        // parse section information
        let currSection = arrSections[j];
        console.log("(getCourse) currSection.section_num: ", currSection.section_num);
        console.log("(getCourse) currSection.term_section_id: ", currSection.term_section_id);
        // log units of this section type
        mapSecTypeToUnits[currSection.section_type] = currSection.units;

        let mapClassObj = {}; // map of index to Class objects of this section
        let mapClassObjIndex = 0;
        for (let k = 0; k < currSection.classes.length; k++) {
            let currClass = currSection.classes[k];
            let currClassObj = 
                new Class(currSection.course_num, currSection.course_title, currSection.section_num, currSection.section_type, 
                            currClass.day_of_week, currClass.start_time, currClass.end_time, currClass.room, 
                            currClass.campus, currClass.instructor, currSection.term_section_id, termCourseId);
            mapClassObj[mapClassObjIndex] = currClassObj;
            mapClassObjIndex++;
        } // (End of) iteration through classes
        let currSectionObj = 
            new Section(currSection.course_num, currSection.course_title, currSection.section_num, currSection.section_type, currSection.units, mapClassObj, 
                        getDescriptiveCourseStatus(currSection.status), currSection.term_section_id, termCourseId);
        
        // append section object to mapSecTypeToSectionMap
        if (mapSecTypeToSectionMap[currSection.section_type] === undefined) {
            mapSecTypeToSectionMap[currSection.section_type] = {'0': currSectionObj};
            console.log("(getCourseObject) mapSecTypeToSectionMap: ", mapSecTypeToSectionMap);
        }
        else {
            indexMapSecTypeToSectionMap = Object.keys(mapSecTypeToSectionMap[currSection.section_type]).length;
            console.log("(getCourseObject) indexMapSecTypeToSectionMap: ", indexMapSecTypeToSectionMap);
            mapSecTypeToSectionMap[currSection.section_type][indexMapSecTypeToSectionMap] = currSectionObj;
            console.log("(getCourseObject) mapSecTypeToSectionMap: ", mapSecTypeToSectionMap);
        }
    } // (End of) iteration through sections
    let courseObject = 
        new Course(currSection.course_num, currSection.course_title, Object.keys(mapSecTypeToSectionMap), 
                    mapSecTypeToSectionMap, getTotalUnits(mapSecTypeToUnits), termCourseId);
    return courseObject;
}

/**
 * Gets all sections associated with a course.  
 * @param {*} termCourseIdInput
 * @return {array} 
 */
const getSectionsForSingleCourse = async (termCourseIdInput) => {
    try {
        // term_course_id is a string
        let dbSections = mongoose.connection.collection("sections"); // get MongoDB collection
        let cursor = await dbSections.find({term_course_id: termCourseIdInput});
        let documents = [];
        await cursor.forEach(async (doc) => {
            
            doc._id = doc["_id"].valueOf(); //Pam CHANGE THIS
            documents.push(doc);
        });
        return documents;
    }
    catch(e) {
        errorHandler(e);
    }
}

/**
 * Get the total number of units (SHUs) of a course. 
 * @param {*} mapSecTypeToUnits e.g.{'Lecture': 3, 'Laboratory': 2}
 * @return {number}
 */
const getTotalUnits = async (mapSecTypeToUnits) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return Object.values(mapSecTypeToUnits).reduce(reducer);
}

/**
 * The course status of SIS is a single letter, and that's a little confusing.
 * @param {string} notSoDescriptiveSISCourseStatus
 * @return {array} 
 */
const getDescriptiveCourseStatus = async (notSoDescriptiveSISCourseStatus) => {
    // mapping of SIS's section status to more readable format used by us
    let mapStatusFormat = {
        "O": "open",
        "C": "closed",
        "W": "waitlist" };
    return mapStatusFormat[notSoDescriptiveSISCourseStatus];
}

const errorHandler = (e) => {
    console.log("(coursesTerm errorHandler)");
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Course Term Error", detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Course Term Error", detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Course Term Error", detail: e.message };
        }
        else {
            console.error(e.message);
            throw { id: "000", status: "500", title: "Course Term Error", detail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
        else {
            throw { id: "000", status: "500", title: "Course Term Error", detail: e.message };
        }
    }
}

exports.getCourseObject = getCourseObject;
exports.getSectionsForSingleCourse = getSectionsForSingleCourse;