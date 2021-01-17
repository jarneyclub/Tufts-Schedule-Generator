const timeUtils = require("./utils/timeUtils.js");
const treeClasses = require('../models/internal/treeClasses.js');
const memwatch = require('@airbnb/node-memwatch');

const Permutations = require('./utils/permutationsUtils.js');
const CountingSort = require('./utils/countingsortUtils.js');

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
 * 3) Use treeClasses to filter section permutations that have overlaps
 * 4) Filter section permutations that don't include all courses
 * 5) 
 * 
 * @param {any} arrayCourses 
 * @param {object} filter
 * @returns 
 */
const generateCourseSchedule = (arrayCourses, filter) => {

    console.log("done");
    
    /* get possible digits for permutations */

    ////////////////////////////////////////
    //                                    //
    //         Get Possible Digits        //
    //                                    //
    ////////////////////////////////////////
    
    let start = Date.now();

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

    let end = Date.now();
    let difference = end - start;
    let timeTakenString = difference.toString() + "ms";
    console.log("Get Possible Digits took: ", timeTakenString);

    ////////////////////////////////////////
    //                                    //
    //        Generate Permutations       //
    //                                    //
    ////////////////////////////////////////
    
    start = Date.now();

    /* (only when using dynamic programming) perform counting sort on possibleDigits for more consistent memoisation */
    let sortedObject = CountingSort.countingSort(possibleDigits, 31);
    let sortedDigits = sortedObject.sorted; // permutations will run on this array of integers
    let references = sortedObject.references; // a map of indices in which entry in index e is the index in chosenSectionType (list of sections)

    end = Date.now();
    difference = end - start;
    timeTakenString = difference.toString() + "ms";
    console.log("CountingSort took: ", timeTakenString);

    /* get permutations */
    start = Date.now();

    let chosenPermutations = Permutations.getPermutations(sortedDigits);
    console.log("chosenPermutations.length: ", chosenPermutations.length);
    end = Date.now();
    difference = end - start;
    timeTakenString = difference.toString() + "ms";
    console.log("getPermutations() took: ", timeTakenString);

    start = Date.now();
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
        
        ////////////////////////////////////////
        //                                    //
        //           Use Permutations         //
        //                                    //
        ////////////////////////////////////////

        /* map digit permutations to a section for each section type */
        for (let j in permutation) {

            /* each iteration through an index in permutation 
            is an interation over sectiontype, an index in arraySectionTypes
            */

            let chosenSectionType = arraySectionTypes[j];
            
            let realReference = references[j];

            let digit = permutation[realReference];

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
        
        ////////////////////////////////////////
        //                                    //
        //        Filter ideal schedules      //
        //                                    //
        ////////////////////////////////////////

        let allClassesInserted = true;
        let classesTimeNotSpecified = []; // array that holds classes of which time wasn't specified
        let ClassesTree = new treeClasses(filter);
        
        /* Go through each permutation and assign classes by each index's digit */

        // iterate through sections mapped to permutation
        for (let k = 0; k < chosenSections.length; k++) {
            let section = chosenSections[k];

            let classes = section.getClasses();

            /* check if all classes of this section does not overlap with one another */

            // iterate through classes
            for (let p in classes) {
                // insert into tree to check overlap
                try {
                    let classToInsert = classes[p];

                    if (classToInsert.getStartTime() == -1 && classToInsert.getEndTime() == -1) {
                        /* Class period's time is not specified, so just add to an array for later appending and don't process in treeClasses */
                        classesTimeNotSpecified.push(classToInsert);
                    }
                    else {
                        /* Class period time is specified. Use treeClasses to check for overlaps */
                        ClassesTree.insert(classToInsert);
                    }

                }
                catch (e) {
                    // console.log(e);
                    allClassesInserted = false;
                    // console.log("---------END (allClasses NOT inserted)---------");
                    // console.log(e);
                    break;
                }
            }

            if (allClassesInserted == false)
                break;
        }

        /* if nothing overlaps, add to resultClasses */
        if (allClassesInserted == true) {
            resultClasses[resultClassesIndex] = [];

            resultClasses[resultClassesIndex] = ClassesTree.getObjects();

            for (let j = 0; j < classesTimeNotSpecified.length; j++) {
                resultClasses[resultClassesIndex].push(classesTimeNotSpecified[j]);
            }

            resultClassesIndex++;
        }
    }

    console.log("phase 1 has finished");
    end = Date.now();
    difference = end - start;
    timeTakenString = difference.toString() + "ms";
    console.log("Use permutations and Filter ideal scchedule took: ", timeTakenString);
    return resultClasses;
}


const chosenClassesToApiDetails = (chosenClasses) => {
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
        "Sunday": [],
        "Unscheduled":[]
    }

    for (let i in classes) {
        let singleClass = classes[i];

        let day = singleClass.getDayOfWeek();

        /* parse class information */
        let time_start = singleClass.getStartTime();
        let time_end = singleClass.getEndTime();

        // Convert integer times to military time
        let time_start_military = timeUtils.integerToMilitaryTime(time_start);
        let time_end_military = timeUtils.integerToMilitaryTime(time_end);

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
            time_start: time_start_military,
            time_end: time_end_military
        }

        switch (day) {
            case -1:
                result["Unscheduled"].push(eventObject);
                break;
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

exports.generateCourseSchedule = generateCourseSchedule;
exports.chosenClassesToApiDetails = chosenClassesToApiDetails;