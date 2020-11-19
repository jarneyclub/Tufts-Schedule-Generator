const Section = require('./Section.js');
const Course = require('./Course.js');

/** Check if two time intervals overlap
 * Time Complexity: O(1) => one OR comparison of two inputs
 * @param {any} timeIntervalA [day of week, begin time, end time]
 * @param {any} timeIntervalB [day of week, begin time, end time]
 */
function doesNotOverlap(timeIntervalA, timeIntervalB) {
    var dayA = timeIntervalA[0];
    var dayB = timeIntervalB[0];

    // the time intervals are on the same day of the week
    if ( dayA == dayB ) {
        var beginA = timeIntervalA[1];
        var beginB = timeIntervalB[1];
        var endA = timeIntervalA[2];
        var endB = timeIntervalB[2];
        // O(1) comparison
        if ( (beginA <= beginB && beginB <= endA) || (beginB <= beginA && beginA <= endB) ) {
            return false;
        }
        else {
            return true;
        }

    }
    else {
        return true;
    }
}

/** Check if a section's time period is within a time interval
 * Time Complexity: O(1) => one OR comparison of two inputs
 * @param {Section} section Section object to range check
 * @param {[start, end]} timeInterval an array of integer of size 2
 * @returns {boolean} 
 */
function sectionWithinBounds(section, timeInterval) {
    var begin = timeInterval[0];
    var end = timeInterval[1];

    if ( section.getStartTime() >= begin && section.getEndTime() <= end ) {
        return true
    }
    else {
        return false
    }
}

/** Finite map Course objects for basic data structure
 * @param {object} courses
 * @returns {object} finite map (key: courseID, value: Course object)
 */
function initializeCourseDictionary(courses) {
    var dictionaryCourses = {};

    // iterate over every course
    for (var courseID in courses) {

        var courseInfo = courses[courseID]; // complete information of a course
        var listSections = []; // list of Section objects for this course

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

                        /* sometimes the setting for the course can still be TBA, in that case, disregard section*/
                        if (sectionTime !== null) {
                            // make new Section object based off of all info gathered
                            var newSection = new Section(courseID, sectionName, sectionType, sectionTime, sectionLocation, sectionCity, sectionInstructors);
                            // add to the list of Sections
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

exports.doesNotOverlap = doesNotOverlap;
exports.sectionWithinBounds = sectionWithinBounds;
exports.initializeCourseDictionary = initializeCourseDictionary;