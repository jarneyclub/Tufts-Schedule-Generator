/* utils */
const getPossibleDigits = require('./utils/getPossibleDigits.js');
const generatePermutations = require('./utils/generatePermutations.js');
const getIdealSchedules = require('./utils/getIdealSchedules.js');
const chosenClassesToApiDetails = require('./utils/chosenClassesToApiDetails.js');


const timeUtils = require("../utils/timeUtils.js");
const treeClasses = require('../../models/internal/treeClasses.js');
const memwatch = require('@airbnb/node-memwatch');

const Permutations = require('../utils/permutationsUtils.js');
const CountingSort = require('../utils/countingsortUtils.js');

// const mapSectionTypes = (arrayCourses) => {
//     let arraySections = [];
//     for (i in arrayCourses) {
//         let course = arrayCourses[i];
//         let sectionsInSecTypes = course.getSections();

//         for (let j in sectionsInSecTypes) {
//             let sections = sectionsInSecTypes[j];

//             arraySections.push(sections);
//         }
//     }
//     return arraySections;
// }

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
    return new Promise ((resolve, reject) => {
        
        console.log("(api/courses/schedule):", "Now generating course schedule...");

        let global = {
            "arrayCourses": arrayCourses,
            "filter": filter
        }

        getPossibleDigits(global)
            .then(
                (global) => generatePermutations(global)
            )
            .then(
                (global) => getIdealSchedules(global)
            )
            .then(
                (global) => {
                    
                    let resultClassesIndex = global.resultClassesIndex;
                    if (resultClassesIndex !== 0) {

                        let result = chosenClassesToApiDetails(global)
                        resolve(result);
                    }
                    else {
                        reject("No schedule could be matched with the given courses and user preferences");
                    }
                }
            )
    });


    /*
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
    console.log("(api/courses/schedule):", "Get Possible Digits took: ", timeTakenString);
    */

    ////////////////////////////////////////
    //                                    //
    //        Generate Permutations       //
    //                                    //
    ////////////////////////////////////////
    
    // start = Date.now();

    // /* (only when using dynamic programming) perform counting sort on possibleDigits for more consistent memoisation */
    // let sortedObject = CountingSort.countingSort(possibleDigits, 31);
    // let sortedDigits = sortedObject.sorted; // permutations will run on this array of integers
    // let references = sortedObject.references; // a map of indices in which entry in index e is the index in chosenSectionType (list of sections) USED

    // end = Date.now();
    // difference = end - start;
    // timeTakenString = difference.toString() + "ms";
    // console.log("(api/courses/schedule):", "CountingSort took: ", timeTakenString);

    // /* get permutations */
    // start = Date.now();

    // let chosenPermutations = Permutations.getPermutations(sortedDigits); //used 
    // console.log("(api/courses/schedule):", "chosenPermutations.length: ", chosenPermutations.length);
    // end = Date.now();
    // difference = end - start;
    // timeTakenString = difference.toString() + "ms";
    // console.log("(api/courses/schedule):", "getPermutations() took: ", timeTakenString);

    for (let key in resultClasses) {
        let entry = resultClasses[key];
        if (entry !== undefined)
            console.log(key, " : ", "defined");
        else
            console.log(key, " : ", "undefined");
    }

    return resultClasses;
}


// const chosenClassesToApiDetails = (chosenClasses) => {
//     let size = Object.keys(chosenClasses).length;

//     let randomIndex = Math.ceil(Math.random() * (size - 1));

//     let classes = chosenClasses[randomIndex];

//     let result = {
//         "Monday": [],
//         "Tuesday": [],
//         "Wednesday": [],
//         "Thursday": [], 
//         "Friday": [],
//         "Saturday": [],
//         "Sunday": [],
//         "TimeUnspecified":[],
//         "Unscheduled": []

//     }

//     for (let i in classes) {
//         let singleClass = classes[i];

//         let day = singleClass.getDayOfWeek();

//         /* parse class information */
//         let time_start = singleClass.getStartTime();
//         let time_end = singleClass.getEndTime();

//         // Convert integer times to military time
//         let time_start_military = timeUtils.integerToMilitaryTime(time_start);
//         let time_end_military = timeUtils.integerToMilitaryTime(time_end);

//         let sectionName = singleClass.getSectionName();
//         let courseId = singleClass.getCourseID();
//         let courseName = singleClass.getCourseName();
//         let room = singleClass.getLocation();
//         let city = singleClass.getCity();

//         let location = room + "," + city;
//         let eventName = sectionName;
//         let eventDetails = courseName + ", " + courseId;

//         let eventObject = {
//             name: eventName,
//             details: eventDetails,
//             location: location,
//             time_start: time_start_military,
//             time_end: time_end_military
//         }

//         console.log("courseName: ", courseName);
//         console.log("day: ", day);

//         switch (day) {
//             case -1:
//                 result["TimeUnspecified"].push(eventObject);
//                 break;
//             case 1:
//                 result["Monday"].push(eventObject);
//                 break;
//             case 2:
//                 result["Tuesday"].push(eventObject);
//                 break;
//             case 3:
//                 result["Wednesday"].push(eventObject);
//                 break;
//             case 4:
//                 result["Thursday"].push(eventObject);
//                 break;
//             case 5:
//                 result["Friday"].push(eventObject);
//                 break;
//             case 6:
//                 result["Saturday"].push(eventObject);
//                 break;
//             case 7:
//                 result["Sunday"].push(eventObject);
//                 break;
//         }


//     }

//     return result;

// }

exports.generateCourseSchedule = generateCourseSchedule;