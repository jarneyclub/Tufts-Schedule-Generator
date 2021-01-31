const treeClasses = require('../../../models/internal/treeClasses.js');

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

const getIdealSchedules = (global) => {

    return new Promise ((resolve, reject) => {

        let references = global.references;
        let chosenPermutations = global.chosenPermutations;
        let arrayCourses = global.arrayCourses;
        let filter = global.filter;

        let start = Date.now();
        let arraySectionTypes = mapSectionTypes(arrayCourses); //used 
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

                        if (classToInsert.getStartTime() === -1 && classToInsert.getEndTime() === -1) {
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

        /* add global variables */
        global.resultClasses = resultClasses;
        global.resultClassesIndex = resultClassesIndex;

        console.log("(api/courses/schedule):", "Course schedule generation is complete");

        let end = Date.now();
        let difference = end - start;
        let timeTakenString = difference.toString() + "ms";

        console.log("(api/courses/schedule):", "Use permutations and Filter ideal scchedule took: ", timeTakenString);

        resolve(global);
    })
}

module.exports = getIdealSchedules;