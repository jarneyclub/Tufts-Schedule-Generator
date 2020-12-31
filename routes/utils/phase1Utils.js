const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const Tree1 = require('./Tree1.js');
const Tree2 = require('./Tree2.js');
const memwatch = require('@airbnb/node-memwatch');

const Permutations = require('./permutations.js');

const mapSectionTypes = (arrayCourses) => {
    let arraySections = [];
    for (i in arrayCourses) {
        let course = arrayCourses[i];
        let sectionsInSecTypes = course.getSections();

        for (let j in sectionsInSecTypes) {
            let sections = sectionsInSecTypes[j];

            arraySections.push(sections);
        }
    }
    return arraySections;
}

/**
 * 1) Get permutations
 * 2) Map permutations to mapping of sectiontypes and its sections
 * 3) Use Tree2 to filter section permutations that have overlaps
 * 4) Filter section permutations that don't include all courses
 * 5) 
 * 
 * @param {any} arrayCourses 
 * @param {object} filter
 * filter = {
 *      time: {
 *          1: { (1 for Monday)
 *             time_earliest: 600,
 *             time_latest: 1440
 *          },
 *          2: { (2 for Tuesday)
 *              time_earliest: 0, (DEFAULT)
 *              time_latest: 2400 (DEFAULT)
 *          },
 *          etc.
 *      }
 * }
 * @returns 
 */
const phase1 = (arrayCourses, filter) => {

    console.log("done");
    
    /* get possible digits for permutations */

    let possibleDigits = [];

    // iterate through courses
    for (let index in arrayCourses) {
        let course = arrayCourses[index];
        let sections = course.getSections();

        // iterate through section types
        for (let sectiontype in sections) {
            let sectionsInSecType = sections[sectiontype];

            // append maximum digits
            possibleDigits.push(Object.keys(sectionsInSecType).length-1);
        }

    }

    let chosenPermutations = Permutations.getPermutations(possibleDigits);
    
    let arraySectionTypes = mapSectionTypes(arrayCourses);
    // console.log("arraySectionTypes: ", arraySectionTypes);

    let resultClasses = {};
    let resultClassesIndex = 0;
    for (let i = 0; i < chosenPermutations.length; i++) {
        let permutation = chosenPermutations[i];

        let chosenSections = [];
        /* 
        chosenSections is an array of Sections that were selected by picking 
        a Section out from arraySectionTypes with mapping from a permutation
        */

        /* map digit permutations to a section for each section type */
        for (let j in permutation) {
            /* each iteration through an index in permutation 
            is an interation over sectiontype, an index in arraySectionTypes
            */

            let chosenSectionType = arraySectionTypes[j];
            let digit = permutation[j];
            let chosenSection = chosenSectionType[digit];
            if (chosenSection == undefined) {
                console.log("######################")
                console.log("chosenSection: ", chosenSection);
                console.log("digit: ", digit);
                console.log("chosenSectionType: ", chosenSectionType);
                console.log("chosenSectionType.length: ", chosenSectionType.length);
                console.log("j: ", j);
                console.log("permutation.length: ", permutation.length);
                console.log("permutation: ", permutation);
                console.log("######################")
            }
            chosenSections.push(chosenSection);
        }

        // console.log("chosenSections.length: ", chosenSections.length);

        // console.log("chosenSections: ", chosenSections);
        
        let nothingOverlaps = true;

        let ClassesTree = new Tree2(filter);

        // iterate through sections mapped to permutation
        for (let k = 0; k < chosenSections.length; k++) {
            let section = chosenSections[k];

            let classes = section.getClasses();

            /* check if all classes of this section does not overlap with one another */

            // itereate through classes
            for (let p in classes) {
                // insert into tree to check overlap
                try {
                    ClassesTree.insert(classes[p]);
                }
                catch (e) {
                    console.log(e);
                    nothingOverlaps = false;
                }
            }
        }

        /* if nothing overlaps, add to resultClasses */
        if (nothingOverlaps) {
            resultClasses[resultClassesIndex] = [];
            for (let k = 0; k < chosenSections.length; k++) {
                let section = chosenSections[k];

                let classes = section.getClasses();

                console.log("classes: ", classes);
                // itereate through classes
                for (let p in classes) {
                    // insert class
                    resultClasses[resultClassesIndex].push(classes[p]);
                }
            }
            resultClassesIndex++;
        }

    }
    // console.log("resultClasses: ", resultClasses);
    console.log("done");
    return resultClasses;
}


const chosenClassToApiDetails = (chosenClasses) => {
    let size = Object.keys(chosenClasses).length;

    let randomIndex = Math.ceil(Math.random() * (size - 1));

    let classes = chosenClasses[randomIndex];

    let result = {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": [],
        "Sunday": []
    }

    for (let i in classes) {
        let singleClass = classes[i];

        let day = singleClass.getDayOfWeek();

        /* parse class information */
        let time_start = singleClass.getStartTime();
        let time_end = singleClass.getEndTime();
        let sectionName = singleClass.getSectionName();
        let courseId = singleClass.getCourseID();
        let courseName = singleClass.getCourseName();
        let room = singleClass.getLocation();
        let city = singleClass.getCity();

        let location = room + "," + city;
        let eventName = sectionName;
        let eventDetails = courseName + ", " + courseId;

        let eventObject = {
            name: eventName,
            details: eventDetails,
            location: location,
            time_start: time_start,
            time_end: time_end
        }

        switch (day) {
            case 1:
                result["Monday"].push(eventObject);
                break;
            case 2:
                result["Tuesday"].push(eventObject);
                break;
            case 3:
                result["Wednesday"].push(eventObject);
                break;
            case 4:
                result["Thursday"].push(eventObject);
                break;
            case 5:
                result["Friday"].push(eventObject);
                break;
            case 6:
                result["Saturday"].push(eventObject);
                break;
            case 7:
                result["Sunday"].push(eventObject);
                break;
        }


    }

    return result;

}

exports.phase1 = phase1;
exports.chosenClassToApiDetails = chosenClassToApiDetails;