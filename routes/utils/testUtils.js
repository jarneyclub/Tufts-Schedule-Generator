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

const testTree1 = () => {
    console.log("### Testing Tree1 ###");
    /* BASIC BST INVARIANT TESTING */
    let tree = new Tree1();
    let testSections = [];

    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "E", "testSec", [[1, 3], [6, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "D", "testSec", [[1, 3], [4, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [5, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "C", "testSec", [[1, 3], [9, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "G", "testSec", [[1, 3], [10, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "F", "testSec", [[1, 3], [8, 15]], "test location", "test city", ["test instructor"]))

    /* insert sections */
    for (let index in testSections)
        tree.insert(testSections[index]);
    
    console.log("Test BST Invariant: ");
    tree.print("inorder");
    /* END BASIC BST INVARIANT TESTING */
    
    /* TEST LEFT ROTATION */
    console.log("Test AVL leftRotate: ");

    testSections = [];
    tree = new Tree1();
    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [5, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "C", "testSec", [[1, 3], [9, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "D", "testSec", [[1, 3], [10, 15]], "test location", "test city", ["test instructor"]))
    testSections.push(new Section("Test", "E", "testSec", [[1, 3], [11, 15]], "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testSections)
        tree.insert(testSections[index]);
    /*
            A
        B      C
                   D
                        E
    */


    console.log("BST Invariant: ");
    console.log("Expected inorder print: [B,A,C,D,E] ");
    tree.print("inorderSecName");

    console.log("Expected node: D");
    let root = tree.getRoot();
    console.log(root.right.getObjects()[0].getSectionName());
    tree.print('tree');

    /* test right rotation */
    // tree.rightRotate(root.right);

    tree.print("inorderSecName");
    
}
exports.testTree1 = testTree1;
exports.getRandomCourse = getRandomCourse;
exports.randomIntegerBetween = randomIntegerBetween;