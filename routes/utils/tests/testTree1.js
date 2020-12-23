const Tree1 = require('./Tree1.js');
const Section = require('./objects/classes/Section.js');
const Class = require('./objects/classes/Class.js');

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const testInsertion = () => {
    console.log("--- unit test: ( INSERTION ) ---")
    /* INITIALIZE TREE */
    let tree = new Tree1();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 7, 15, "test location", "test city", ["test instructor"]))

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];
        // day * 2400 + starttime so that all classes in a week can be inserted into one avl tree
        let value = object.getDayOfWeek() * 2400 + object.getStartTime();
        let augmentation = object.getDayOfWeek() * 2400 + object.getEndTime();
        let sectionName = object.getSectionName();
        // Note: insert(object, value, name, augmentation)
        tree.insert(object, value, sectionName, augmentation);
    }

    console.log("--- end: ( INSERTION ) ---")
}

const testLeftInsertion = () => {
    console.log("--- unit test: ( LEFT INSERTION ) ---")
    /* INITIALIZE TREE */

    let tree = new Tree1();
    let testSections = [];
    testSections.push(new Section("Test", "A", "testSec", [[1, 3], [7, 15]], "test location", "test city", ["test instructor"]));
    testSections.push(new Section("Test", "B", "testSec", [[1, 3], [6, 15]], "test location", "test city", ["test instructor"]));

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
    testInsertion();
    // testLeftInsertion();
    // testRightInsertion();
    // testBSTInvariant();

}
exports.testTree1 = testTree1;