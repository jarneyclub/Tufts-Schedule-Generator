const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const Class = require('./objects/classes/Class.js');

const integerToMilitaryTime = (input) => {

    if (input == -1) {
        let result = "Time not specified";
        return result;
    }
    else {
        let intHour = Math.floor(input / 60);
        let intMinutes = input % 60;

        let strHour;
        let strMin;
        if (intHour < 10)
            strHour = "0" + intHour.toString();
        else
            strHour = intHour.toString();

        if (intMinutes < 10)
            strMin = "0" + intMinutes.toString();
        else
            strMin = intMinutes.toString();
        let result = strHour + ":" + strMin;
        return result;
    }
}

const militaryTimeToInteger = (input) => {
    let splitTime = input.split(/[:]/g);

    let intHour = parseInt(splitTime[0]);
    let intMinutes = parseInt(splitTime[1]);

    let result = intHour * 60 + intMinutes;
    
    return result;
}

////////////////////////////////////////
//                                    //
//         Database: Mongodb          //
//                                    //
////////////////////////////////////////

const documentToCourse = (document) => {
    let courseName = document.course_name;
    let courseId = document.course_id;
    let sections = document.sections;
    let availableSectionTypes = document.available_section_types;
    let objectSectionType = {};

    // iterate through section types
    for (let sectionType in sections) {

        let arraySections = sections[sectionType];
        
        // init object to store
        let objectSection = {};
        let indexObjectSection = 0;

        // iterate through sections
        for (let indexSectionInfo in arraySections) {

            let sectionInfo = arraySections[indexSectionInfo];
            let sectionId = sectionInfo.section_id;
            let arrayClasses = sectionInfo.classes;
            
            // init object to store
            let objectClass = {};
            let indexObjectClass = 0;

            // iterate through classes
            for (let indexClass in arrayClasses) {
                
                // parse document
                let classInfo = arrayClasses[indexClass];
                let timeStart = classInfo.time_start;
                let timeEnd = classInfo.time_end;
                let day = classInfo.day_of_week;
                let faculties = classInfo.faculties;
                let city = classInfo.city; 
                let room = classInfo.room;

                // appended into an object to be stored into Section
                let newClass =
                    new Class(courseId, courseName, sectionId, sectionType, day, timeStart, timeEnd, room, city, faculties);

                // add Class object to objectClass
                objectClass[indexObjectClass] = newClass;
                indexObjectClass++;


            }

            // END of iteration through classes
            let newSection = 
                new Section(courseId, courseName, sectionId, sectionType, objectClass);
            
            // add Section object to objectSection
            objectSection[indexObjectSection] = newSection;
            indexObjectSection++;
        }
        // END of iteration through sections

        // add objectSection to objectSectionType
        objectSectionType[sectionType] = objectSection;
    }
    // END of iteration through section types

    let newCourse = new Course(courseId, courseName, availableSectionTypes, objectSectionType);

    return newCourse;
}

////////////////////////////////////////
//                                    //
//          Database: File            //
//                                    //
////////////////////////////////////////

/** Check if a section's time period is within a time interval
 * Time Complexity: O(1) => one OR comparison of two inputs
 * @param {Section} section Section object to range check
 * @param {[start, end]} timeInterval an array of integer of size 2
 * @returns {boolean} 
 */
function sectionWithinBounds(section, timeInterval) {
    var begin = timeInterval[0];
    var end = timeInterval[1];

    if (section.getStartTime() >= begin && section.getEndTime() <= end) {
        return true
    }
    else {
        return false
    }
}

function getNumberOfCourses(courses_info) {
    var arrayCourseIDs = courses_info.courses_id_names;
    coursesTotal = arrayCourseIDs.length;

    return coursesTotal;
}

/** Finite map Course objects for basic data structure
 * @param {object} courses
 * @returns {object} finite map (key: courseID, value: Course object)
 */
function initializeCourseDictionary(courses_info) {
    var dictionaryCourses = {}; // to return
    var courses = courses_info.courses;

    // iterate over every course
    for (var courseID in courses) {

        var courseInfo = courses[courseID]; // complete information of a course
        var listSections = []; // list of Section objects for this course

        /* check problematic courses */
        // NUTR-0211
        if (courseID == "NUTR-0211") {
            console.log("Problem course (NUTR-0211):\n");
            console.log(courseInfo, "\n");
        }
        else if (courseID == "EN-0001") {
            console.log("Problem course (EN-0001):\n");
            console.log(courseInfo, "\n");
        }
        else if (courseID == "PSY-0191") {
            console.log("Problem course (PSY-01911):\n");
            console.log(courseInfo, "\n");
        }

        // iterate over every sectionType in a course
        var listSectionTypes = courseInfo.section_types;
        for (var index in listSectionTypes) {

            var sectionType = listSectionTypes[index];

            // iterate over every section in a sectionType
            var sectionTypeInfo = courseInfo[sectionType];
            for (var index in sectionTypeInfo) {

                var sectionInfo = sectionTypeInfo[index];

                var sectionName = sectionInfo.section_name;
                var sectionInstructors = sectionInfo.instructors;
                // iterate over every setting for this section
                var sectionSettings = sectionInfo.settings;
                for (var index in sectionSettings) {

                    var sectionSetting = sectionSettings[index];

                    var sectionCity = sectionSetting.city;
                    var sectionLocation = sectionSetting.location;

                    // iterate over every time for this setting
                    var sectionTimes = sectionSetting.times;
                    for (var index in sectionTimes) {
                        var sectionTime = sectionTimes[index]; // {0: [days of week], 1: [begin, end]}

                        if (sectionTime !== null) {
                            // make new Section object based off of all info gathered
                            var newSection = new Section(courseID, sectionName, sectionType, sectionTime, sectionLocation, sectionCity, sectionInstructors);
                            // add to the list of Sections
                            listSections.push(newSection);
                        }
                        /* SOMETIMES the setting for the course can still be TBA, in that case, dont disregard and flag section with time : "-1"s */
                        else {
                            var newSection = new Section(courseID, sectionName, sectionType, {0: [7], 1: [2400, 2400]}, sectionLocation, sectionCity, sectionInstructors);
                            listSections.push(newSection);
                        }
                    }
                }
            }
        }
        // create new Course object with the list of Sections
        var newCourse = new Course(courseID, listSections, listSectionTypes);
        dictionaryCourses[courseID] = newCourse;
    }

    return dictionaryCourses;
}

/** Format course information for human-friendly JSON RPC
 * 
 * 
 * @param {any} courseID 
 * @param {any} information 
 */
function parseCourseInformation(courseID, information) {

    // iterate over every sectionType in a course
    var listSectionTypes = information.section_types;
    for (var index in listSectionTypes) {

        var sectionType = listSectionTypes[index];

        // iterate over every section in a sectionType
        var sectionTypeInfo = information[sectionType];
        for (var index in sectionTypeInfo) {
            var section = {}; // init section object
            var sectionInfo = sectionTypeInfo[index];

            var sectionName = sectionInfo.section_name;
            var sectionInstructors = sectionInfo.instructors;
            // iterate over every setting for this section
            var sectionSettings = sectionInfo.settings;
            for (var index in sectionSettings) {

                var sectionSetting = sectionSettings[index];

                var sectionCity = sectionSetting.city;
                var sectionLocation = sectionSetting.location;

                // iterate over every time for this setting
                var sectionTimes = sectionSetting.times;
                for (var index in sectionTimes) {
                    var sectionTime = sectionTimes[index]; // {0: [days of week], 1: [begin, end]}

                    /* sometimes the setting for the course can still be TBA, in that case, disregard section*/
                    if (sectionTime !== null) {
                        section.name = sectionName;
                        section.instructors = sectionInstructors;
                    }
                }
            }
        }
    }

}

exports.sectionWithinBounds = sectionWithinBounds;
exports.initializeCourseDictionary = initializeCourseDictionary;
exports.parseCourseInformation = parseCourseInformation;
exports.getNumberOfCourses = getNumberOfCourses;
exports.documentToCourse = documentToCourse;
exports.integerToMilitaryTime = integerToMilitaryTime;
exports.militaryTimeToInteger = militaryTimeToInteger;