const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const permutations = require('./permutations.js');
const memwatch = require('@airbnb/node-memwatch');

/**
 * @param {array} selectedCoursesIDs 
 * @returns {object} 
 * e.g.
    mapCourseToSectionType:  {
      'SPN-0032': { Lecture: [ [Section] ] },
      'AMER-0186': { Lecture: [ [Section], [Section] ] },
      'TPS-0161': { Lecture: [ [Section] ] },
      'NUTR-0211': { Lecture: [] },
      'PHY-0293': { Lecture: [ [Section] ] }
    }
 */
const mapCoursesToSectionTypes = (courseDictionary, selectedCoursesIDs) => {

    let mapCourseToSectionType = {};
    // get Course objects from course ids
    for (let index in selectedCoursesIDs) {
        let courseID = selectedCoursesIDs[index];
        let course = courseDictionary[courseID];
        mapCourseToSectionType[courseID] = course.getSections();
    }

    console.log("course to section types mapping: ", mapCourseToSectionType);
    return mapCourseToSectionType;
}

exports.mapCourseToSectionTypes = mapCoursesToSectionTypes;