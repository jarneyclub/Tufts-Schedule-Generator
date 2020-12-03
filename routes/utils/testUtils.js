const Tree1 = require('./Tree1.js');
const Section = require('./objects/classes/Section.js');
const phase0 = require('./phase0Utils.js');
const phase1 = require('./phase1Utils.js');

// get random course
const getRandomCourse = (courseDictionary, courseIDs, coursesTotal) => {
    var numberOfCourses = coursesTotal;
    var randomIndex = randomIntegerBetween(0, numberOfCourses-1);
    
    var randomID = courseIDs[randomIndex];
    console.log(courseIDs)
    return courseDictionary[randomID];

}
// generate a randomInteger that is greater than lowerBound
// May block code
// Note: lowerBound must be (0-2400)
const randomIntegerBetween = (lowerBound, upperBound) => {
    var randomIntCandidate = Math.random() * upperBound;

    while (randomIntCandidate <= lowerBound) {
        randomIntCandidate = Math.random() * upperBound;
    }

    return parseInt(randomIntCandidate);
}

exports.testPhase1 = (courseDictionary, __courseIDs, __coursesTotal) => {

    // get 5 random courses
    let selectedCourses = []; // array of course IDS
    while (selectedCourses.length < 5) {
        let randomCourseID = getRandomCourse(courseDictionary, __courseIDs, __coursesTotal).getCourseName();
        // check if random course already exists in array
        let doesntExist = true;
        for (let i = 0; i < selectedCourses.length; i++) {
            if (selectedCourses[i] == randomCourseID) {
                doesntExist = false;
            }
        }

        if (doesntExist)
            selectedCourses.push(randomCourseID);
    }

    // manual selection of course
    selectedCourses.push("CHEM-0011");

    console.log("selected courses: ", selectedCourses);

    let mapCourseToSectionType = phase0.mapCoursesToSectionTypes(courseDictionary, selectedCourses);
    /* e.g.
        mapCourseToSectionType: {
           'SPN-0032': { Lecture: [[Object]] },
           'AMER-0186': { Lecture: [[Object], [Object]] },
           'TPS-0161': { Lecture: [[Object]] },
           'NUTR-0211': { Lecture: [] },
           'PHY-0293': { Lecture: [[Object]] }
    }
    */

    let mapTree1Courses = phase1.mapCoursesToTree1s(mapCourseToSectionType);
    /* let mapTree1Courses = {
        COURSEID: {
            "Lecture": Tree1()all
        },
        COURSEID2: {
            
        },
        etc.
    } */

    console.log("phase 1 tree mapping: ", mapTree1Courses);

    for (let key in mapTree1Courses) {
        for (let secType in mapTree1Courses[key]) {
            mapTree1Courses[key][secType].print("inorder");
        }
    }

}

const arrayEquals = (a,b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const testLeftInsertion = () => {
    console.log("--- unit test: ( LEFT INSERTION ) ---")
    /* INITIALIZE TREE */

    let tree = new Tree1();
    let testSections = [];
    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [6, 15]], "test location", "test city", ["test instructor"]));
    // testSections.push(new Section("Test", "C", "testSec", [[1, 3], [5, 15]], "test location", "test city", ["test instructor"]));
    // testSections.push(new Section("Test", "D", "testSec", [[1, 3], [4, 15]], "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testSections)
        tree.insert(testSections[index]);

    /* END init tree */

    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', null, null, null]
    if (arrayEquals(output, answer))
        console.log("Success")
    else {
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
    }

    console.log("--- end: ( LEFT INSERTION ) ---");
}

const testRightInsertion = () => {
    console.log("--- unit test: ( RIGHT INSERTION ) ---")
    /* INITIALIZE TREE */

    let tree = new Tree1();
    let testSections = [];
    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [8, 15]], "test location", "test city", ["test instructor"]));
    // testSections.push(new Section("Test", "C", "testSec", [[1, 3], [5, 15]], "test location", "test city", ["test instructor"]));
    // testSections.push(new Section("Test", "D", "testSec", [[1, 3], [4, 15]], "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testSections)
        tree.insert(testSections[index]);

    /* END init tree */

    let output = tree.print("array");
    let answer = [undefined, 'A', null, 'B', null, null]
    if (arrayEquals(output, answer))
        console.log("Success");
    else {
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        tree.print("tree");
    }

    console.log("--- end : ( RIGHT INSERTION ) ---")
}

const testBSTInvariant = () => {
    console.log("--- unit test: ( BST INVARIANT ) ---")
    /* INITIALIZE TREE */

    let tree = new Tree1();
    let testSections = [];
    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [8, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "C", "testSec", [[1, 3], [6, 15]], "test location", "test city", ["test instructor"]));
    // testSections.push(new Section("Test", "D", "testSec", [[1, 3], [4, 15]], "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testSections)
        tree.insert(testSections[index]);

    /* END init tree */

    let output = tree.print("array");
    let answer = [undefined, 'A', 'C', 'B', null, null, null, null];
    console.log(output);
    if (arrayEquals(output, answer))
        console.log("Success");
    else {
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
    }
    console.log("--- end : ( BST INVARIANT ) ---")
}

const testLeftRotation = () => {
    console.log("--- unit test: ( AVL Tree LEFT ROTATION ) ---")
    console.log("--- end : ( AVL Tree LEFT ROTATION ) ---")
}

const testLeftRotationRoot = () => {
    console.log("--- unit test: ( AVL Tree LEFT ROTATION on ROOT ) ---")
    console.log("--- end : ( AVL Tree LEFT ROTATION on ROOT ) ---")
}

const testRightRotation = () => {
    console.log("--- unit test: ( AVL Tree RIGHT ROTATION ) ---")
    console.log("--- end : ( AVL Tree RIGHT ROTATION ) ---")
}

const testRightRotationRoot = () => {
    console.log("--- unit test: ( AVL Tree RIGHT ROTATION on ROOT ) ---")
    console.log("--- end : ( AVL Tree RIGHT ROTATION on ROOT ) ---")
}


const testTree1 = () => {
    console.log("### Testing TREE 1 ###");
    testLeftInsertion();
    testRightInsertion();
    testBSTInvariant();
    
}
exports.testTree1 = testTree1;
exports.getRandomCourse = getRandomCourse;
exports.randomIntegerBetween = randomIntegerBetween;