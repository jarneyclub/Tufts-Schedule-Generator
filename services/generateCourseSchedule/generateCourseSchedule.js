/*
* Name: generateCourseSchedule.js
* High level logic for automattically generating course schedules with user 
* preferences.
* 
* 
*/

/* utils */
const getPossibleDigits = require('./utils/getPossibleDigits.js');
const generatePermutations = require('./utils/generatePermutations.js');
const preprocessFilter = require('./utils/preprocessFilter.js');
const applyFilter = require('./utils/applyFilter.js');
const getIdealSchedules = require('./utils/getIdealSchedules.js');
const chosenClassesToApiDetails = require('./utils/chosenClassesToApiDetails.js');
//formats response to send back to users^
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
        
        console.log("(generateCourseSchedule):", "Now generating course schedule...");

        /* Error catching */
        if (arrayCourses.length == 0)
            reject(new Error("Length of arrayCourses is 0"));
        else if (arrayCourses === undefined)
            reject(new Error("arrayCourses is undefined"));

        let global = {
            "arrayCourses": arrayCourses,
            "filterPreprocessed": undefined,
            "filter": filter,
            "arrSecTypes": undefined,
            "possibleDigits": undefined,
            "references": undefined,
            "chosenPermutations": undefined,
            "resultClasses": undefined,
            "resultClassesIndex": undefined
        };
        // Organize the filter (user preferences) into 
        preprocessFilter(global)
        .then(
            (global) => applyFilter.createArrSectionTypes(global)
        ).catch((err) => { throw err; })
        .then(
            // Uses arrSectionTypes
            (global) => getPossibleDigits(global)
        ).catch((err) => { throw err; })
        .then(
            // Uses possibleDigits
            (global) => generatePermutations(global)
        ).catch((err) => { throw err; })
        .then(
            (global) => getIdealSchedules(global)
        ).catch((err) => { throw err; })
        .then(
            (global) => {
                
                let resultClassesIndex = global.resultClassesIndex;
                if (resultClassesIndex !== 0) {

                    console.log("(generateCourseSchedule):", "Picking random course schedule..");

                    let result = chosenClassesToApiDetails(global);
                    resolve(result);
                }
                else {
                    reject("No schedule could be matched with the given courses and user preferences");
                }
            }
        )
        .catch((err) => { reject(err); })
    });
}
exports.generateCourseSchedule = generateCourseSchedule;