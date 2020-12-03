const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const memwatch = require('@airbnb/node-memwatch');

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
exports.mapCoursesToSectionTypes = (courseDictionary, selectedCoursesIDs) => {

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


/** Helper function
 * 
 * 
 * @param {any} courseID 
 * @param {any} sectionType 
 * @param {any} arraySections 
 * @returns 
 */
const initSectionTypeQueue = (courseID, sectionType, arraySections) => {    
    let sectionTypeQueue = {};
    // let sectionTypeQueue_IND = 0;
    
    // Define courseID sectionType belongs to
    sectionTypeQueue["courseID"] = courseID;
    // Define sectionType
    sectionTypeQueue["sectionType"] = sectionType;
    // Define object listing all sections in sectionType
    sectionTypeQueue["sections"] = arraySections

    // for (index in arraySections) {
        // let sectionObject = arraySections[index];
        // sectionTypeQueue["sections"][0] = sectionObject;
        // sectionTypeQueue_IND++;
    // }
    // Define length of sectionTypeQueue
    // sectionTypeQueue["sectionsLength"] = sectionTypeQueue_IND + 1;

    return sectionTypeQueue;
}

const initMasterStructure = (mapCoursesToSectionTypes, callback) => {
    let masterStructure = {};
    let masterStructureSize = 0;

    // Traverse through each course
    for (courseID in mapCoursesToSectionTypes) {
        let objectSectionTypes = mapCoursesToSectionTypes[courseID];

        // Traverse through each sectionType
        for (sectionType in objectSectionTypes) {
            let arraySections = objectSectionTypes[sectionType];

            masterStructure[masterStructureSize] = 
                initSectionTypeQueue(courseID, sectionType, arraySections);
            masterStructureSize++;
        }
    }

    callback(masterStructure, masterStructureSize++);
}

const recordCombination = (sectionsCombination, combinationRecords) => {
    combinationRecords.push(sectionsCombination);
}

const allCombinations = async (currSecTypeIndex, sectionsCombination, masterStructure, combinationRecords) => {

    // console.log(sectionsCombination, " : ", currSecTypeIndex);
    if ( currSecTypeIndex < sectionsCombination.length ) {

        let possibleSectionsForCurrSecType = 
            masterStructure[currSecTypeIndex].sections
        // console.log("bounded Length: ", possibleSectionsForCurrSecType.length);
        let countShifts = 0;
        // Substitute a section from masterStructure.sections for currSecTypeIndex
        while ( countShifts < possibleSectionsForCurrSecType.length) {
            let section = possibleSectionsForCurrSecType[countShifts];
            // Dequeue & Enqueue operations
            // let shifted = possibleSectionsForCurrSecType.shift();
            // possibleSectionsForCurrSecType.push(shifted);
            countShifts++;

            // console.log(masterStructure);

            let updatedSectionsCombination = [...sectionsCombination]; // copy construct
            updatedSectionsCombination[currSecTypeIndex] = section;

            allCombinations(currSecTypeIndex + 1, updatedSectionsCombination, masterStructure, combinationRecords);
        }
        // sectionsCombination = null;
        // countShifts = null;
        // possibleSectionsForCurrSecType = null;
        // updatedSectionsCombination = null;
    }
    // Base case
    else {
        // console.log("Recording: ", sectionsCombination);
        recordCombination(sectionsCombination, combinationRecords);
    }
}

const phase0 = (mapCoursesToSectionTypes, hd, callback) => {
    initMasterStructure(mapCoursesToSectionTypes, function(masterStructure, masterStructureSize) {
        var combinationRecords = [];

        console.log("masterStructure: ", masterStructure);
        let sectionsCombinationNull = [];

        // init a null, populated list of sectionsCombination
        for (let i = 0; i < masterStructureSize; i++)
            sectionsCombinationNull.push(null);

        allCombinations(0, sectionsCombinationNull, masterStructure, combinationRecords);
        console.log(hd);
        callback(combinationRecords, hd);
    })

}

exports.phase0 = phase0;

exports.testPhase0 = () => {
    testMapInteger = {
        0: {
            sections: [1,2,3,4,5]
        },
        1: {
            sections: [1, 2,3,4,5,6]
        },
        2: {
            sections: [1, 2]
        },
        3: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        4: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        5: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        6: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        7: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        8: {
            sections: [1, 2, 3, 4, 5, 6]
        },
        9: {
            sections: [1, 2, 3, 4, 5, 6]
        }
    }
    var hd = new memwatch.HeapDiff();

    phase0(testMapInteger, hd, function (combinationRecords, hd) {
        // console.log(combinationRecords);
        console.log(combinationRecords.length);
        var diff = hd.end();
        console.log("producing diff");
        console.log("diff: ", diff);
    });

}

memwatch.on('stats', function (stats) {
    console.log(stats);
})