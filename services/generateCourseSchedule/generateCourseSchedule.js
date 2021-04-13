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
            "filter": filter,
            "references": undefined,
            "chosenPermutations": undefined,
            "resultClasses": undefined,
            "resultClassesIndex": undefined
        };

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
                    console.log("resultClassesINdex: ", resultClassesIndex);
                    if (resultClassesIndex !== 0) {

                        let result = chosenClassesToApiDetails(global);
                        console.log("AAAA");
                        resolve(result);
                    }
                    else {
                        reject("No schedule could be matched with the given courses and user preferences");
                    }
                }
            )
    });

exports.generateCourseSchedule = generateCourseSchedule;