const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const Tree1 = require('./Tree1.js');

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

exports.mapCoursesToTree1s = mapCoursesToTree1s;