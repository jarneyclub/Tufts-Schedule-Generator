const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const Tree1 = require('./Tree1.js');

/**
 * @param {array} selectedCoursesIDs 
 * @returns {object} 
 * e.g.
    mapCourseToSectionType:  {
      'SPN-0032': { Lecture: [ [Object] ] },
      'AMER-0186': { Lecture: [ [Object], [Object] ] },
      'TPS-0161': { Lecture: [ [Object] ] },
      'NUTR-0211': { Lecture: [] },
      'PHY-0293': { Lecture: [ [Object] ] }
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
    /*
    mapCourseToSectionType:  {
      'SPN-0032': { Lecture: [ [Object] ] },
      'AMER-0186': { Lecture: [ [Object], [Object] ] },
      'TPS-0161': { Lecture: [ [Object] ] },
      'NUTR-0211': { Lecture: [] },
      'PHY-0293': { Lecture: [ [Object] ] }
    }
    */
    console.log("course to section types mapping: ", mapCourseToSectionType);
    return mapCourseToSectionType;
}

/**
 * @param {mapCoursesToSectionTypes} map 
 * @returns {object}
 * let mapTree1Courses = {
        COURSEID: {
            "Lecture": Tree1()
        },
        COURSEID2: {},
        etc.
    }
 */
const mapCoursesToTree1s = (map) => {
    let mapTree1Courses = {};

    for (let key in map) {
        let sectionTypes = map[key]; // objects of section types of ONE COURSE
        mapTree1Courses[key] = {};

        for (let type in sectionTypes) {

            var sectionTypeTree = new Tree1(); // init phase 1 tree

            let sections = sectionTypes[type]; // array of Section objects
            // populate phase 1 tree
            for (let sectionIndex in sections) {
                let section = sections[sectionIndex];
                sectionTypeTree.insert(section);
            }

            mapTree1Courses[key][type] = sectionTypeTree; // assign phase 1 tree of this section type
        }
    }

    return mapTree1Courses;
}

exports.mapCoursesToSectionTypes = mapCoursesToSectionTypes;
exports.mapCoursesToTree1s = mapCoursesToTree1s;