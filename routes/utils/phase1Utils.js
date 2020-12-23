const Section = require('./objects/classes/Section.js');
const Course = require('./objects/classes/Course.js');
const Tree1 = require('./Tree1.js');
const Tree2 = require('./Tree2.js');

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

const testPhase0 = () => {
    testMapInteger = {
        0: {
            sections: [1,2,3,4,5, 6]
        },
        1: {
            sections: [1, 2,3,4,5,6]
        },
        2: {
            sections: [1, 2, 3, 4, 5, 6]
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
        }
    }
    var hd = new memwatch.HeapDiff();

    phase0(testMapInteger, hd, function (combinationRecords, hd) {
        // console.log(combinationRecords);
        console.log(combinationRecords.length);
    });

    var diff = hd.end();
    console.log("producing diff");
    console.log("diff: ", diff);
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }

}

memwatch.on('stats', function (stats) {
    console.log(stats);
})


exports.mapCoursesToTree1s = mapCoursesToTree1s;