const treeClasses = require('../models/internal/treeClasses.js');
const Class = require('../models/internal/objects/classes/Class.js');

const defaultFilter = {
    time: {
        1: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        2: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        3: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        4: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        5: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        6: [{
            time_earliest: 0,
            time_latest: 2400
        }],
        7: [{
            time_earliest: 0,
            time_latest: 2400
        }]
    }
}

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const testInsertion = () => {
    console.log("--- unit test: ( INSERTION ) ---")

    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 2, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 3, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "D", "testSec", 4, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "E", "testSec", 5, 7, 15, "test location", "test city", ["test instructor"]))

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'B', 'A', 'D', null, null, 'C', 'E']
    if (arrayEquals(output, answer)) {
        result = true;
    }
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end: ( INSERTION ) ---")
    }

    return result;
}

const testLeftInsertion = () => {
    console.log("--- unit test: ( AVL Tree LEFT INSERTION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'B', 'A', null]
    if (arrayEquals(output, answer)) {
        result = true;
    }
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree LEFT INSERTION ) ---")
    }

    return result;
}

const testRightInsertion = () => {
    console.log("--- unit test: ( AVL Tree RIGHT INSERTION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'B', null, 'A']
    if (arrayEquals(output, answer)) {
        result = true;
    }
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree RIGHT INSERTION ) ---")
    }

    return result;
}

const testBSTInvariant = () => {
    console.log("--- unit test: ( AVL Tree BST Invariant ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 900, 1100, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C']
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree BST Invariant ) ---")
    }
    return result;
}

const testLeftRotation = () => {
    console.log("--- unit test: ( AVL Tree LEFT ROTATION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "E", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'D', null, null, 'C', 'E']
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree LEFT ROTATION ) ---")
    }
    return result;
}

const testRightLeftRotation = () => {
    console.log("--- unit test: ( AVL Tree RIGHT,LEFT ROTATION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "E", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'E', null, null, 'C', 'D']
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree RIGHT,LEFT ROTATION ) ---")
    }
    return result;
}

const testLeftRightRotation = () => {
    console.log("--- unit test: ( AVL Tree LEFT,RIGHT ROTATION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "E", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'E', 'C', 'D', 'B', null, null]
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree LEFT,RIGHT ROTATION ) ---")
    }
    return result;
}

const testLeftRotationRoot = () => {
    console.log("--- unit test: ( AVL Tree LEFT ROTATION on ROOT ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 600, 650, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'B', 'A', 'C']
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree LEFT ROTATION on ROOT ) ---")
    }
    return result;
}

const testRightRotation = () => {
    console.log("--- unit test: ( AVL Tree RIGHT ROTATION ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "E", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'D', 'C', 'E', 'B', null, null]
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree RIGHT ROTATION ) ---")
    }
    return result;
}

const testRightRotationRoot = () => {
    console.log("--- unit test: ( AVL Tree RIGHT ROTATION on ROOT ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        // Note: insert(object, value, name, augmentation)
        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'B', 'C', 'A']
    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree RIGHT ROTATION on ROOT ) ---")
    }
    return result;
}

const testNoIntersectionQueryLeft = () => {
    console.log("--- unit test: ( AVL Tree No Intersection Query Left ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 50, 60, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C', 'D', null, null, null];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree No Intersection Query Left) ---")
    }
    return result;
}

const testNoIntersectionQueryRight = () => {
    console.log("--- unit test: ( AVL Tree No Intersection Query Right) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 200, 210, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C', null, null, null, 'D'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree No Intersection Query Right) ---")
    }
    return result;
}

const testIntersectionQueryLeft = () => {
    console.log("--- unit test: ( AVL Tree Intersection Query Left) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 50, 75, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree Intersection Query Left) ---")
    }
    return result;
}

const testIntersectionQueryRight = () => {
    console.log("--- unit test: ( AVL Tree Intersection Query Right) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 160, 175, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree Intersection Query Right) ---")
    }
    return result;
}

const testIntersectionQueryExactSame = () => {
    console.log("--- unit test: ( AVL Tree Intersection Query Right) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree Intersection Query Right) ---")
    }
    return result;
}

const testIntersectionQueryExactSameLeft = () => {
    console.log("--- unit test: ( AVL Tree Intersection Query Right) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( AVL Tree Intersection Query Right) ---")
    }
    return result;
}

const testIntersectionQueryOverlapInside = () => {
    console.log("--- unit test: ( AVL Tree interval A INSIDE interval B ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"])); /* interval B */
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 75, 76, "test location", "test city", ["test instructor"])); /* interval A */

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : (AVL Tree interval A INSIDE interval B)) ---")
    }
    return result;
}

const testIntersectionAnomalyOne = () => {
    console.log("--- unit test: ( AVL Tree Intersection Anomaly 1 ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("CS-0040", "test", "A", "01-LEC", 2, 810, 885, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0040", "test", "B", "01-LEC", 4, 810, 885, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0040", "test", "C", "LAB-LA", 5, 630, 705, "test location", "test city", ["test instructor"]));

    testObjects.push(new Class("CS-0137", "test", "D", "01-LEC", 1, 630, 705, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0137", "test", "E", "01-LEC", 3, 630, 705, "test location", "test city", ["test instructor"]));

    testObjects.push(new Class("CS-0116", "test", "F", "01-LEC", 2, 990, 1065, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0116", "test", "G", "01-LEC", 4, 990, 1065, "test location", "test city", ["test instructor"]));

    testObjects.push(new Class("MATH-0051", "test", "H", "01-LEC", 1, 540, 615, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("MATH-0051", "test", "I", "01-LEC", 5, 540, 615, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("MATH-0051", "test", "J", "06R-RCT", 2, 1170, 1220, "test location", "test city", ["test instructor"]));

    testObjects.push(new Class("CS-0170", "test", "K", "01-LEC", 1, 540, 615, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0170", "test", "L", "01-LEC", 3, 540, 615, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("CS-0170", "test", "M", "RE-RCT", 3, 900, 975, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let output = tree.print("array");
    let answer = [undefined, 'A', 'B', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : (AVL Tree Intersection Anomaly 1)) ---")
    }
    return result;
}

const testTreeGetObjects = () => {
    console.log("--- unit test: ( treeClasses getObjects() ) ---")
    let result = false;
    /* INITIALIZE TREE */
    let tree = new treeClasses(defaultFilter);

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "B", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));
    testObjects.push(new Class("Test", "test", "C", "testSec", 1, 170, 190, "test location", "test city", ["test instructor"]));
    // query interval
    testObjects.push(new Class("Test", "test", "D", "testSec", 1, 70, 80, "test location", "test city", ["test instructor"]));

    /* insert sections */
    for (let index in testObjects) {
        let object = testObjects[index];

        tree.insert(object);
    }

    /* END init tree */
    let objectsReceived = tree.getObjects();
    let output = [];
    for (let i = 0; i < objectsReceived.length; i++ )
        output.push(objectsReceived[i].getSectionName());
    
    let answer = ['B', 'A', 'C'];

    if (arrayEquals(output, answer))
        result = true;
    else {
        tree.print("tree");
        console.log("Failure: ")
        console.log("Expected print: ", answer);
        console.log("Output: ", output);
        console.log("inorder output");
        tree.print("inorder");
        console.log("--- end : ( treeClasses getObjects ) ---")
    }
    return result;
}

const testTree = () => {
    console.log("### Testing TREE 2 ###");
    let testResults = [];
    testResults.push(testInsertion());
    testResults.push(testLeftInsertion());
    testResults.push(testRightInsertion());
    testResults.push(testBSTInvariant());
    testResults.push(testLeftRotation());
    testResults.push(testRightLeftRotation());
    testResults.push(testLeftRightRotation());
    testResults.push(testLeftRotationRoot());
    testResults.push(testRightRotation());
    testResults.push(testRightRotationRoot());
    testResults.push(testNoIntersectionQueryLeft());
    testResults.push(testNoIntersectionQueryRight());
    testResults.push(testIntersectionQueryLeft());
    testResults.push(testIntersectionQueryRight());
    testResults.push(testIntersectionQueryExactSame());
    testResults.push(testIntersectionQueryExactSameLeft());
    testResults.push(testIntersectionQueryOverlapInside());
    testResults.push(testIntersectionAnomalyOne());
    testResults.push(testTreeGetObjects());

    let testsPass = true;
    for (let index in testResults) {
        if (testResults[index] == false) {
            testsPass = false;
        }
    }

    if (testsPass == true)
        console.log("treeClasses passed all tests")
    else
        console.log("treeClasses DID NOT pass all tests")


}

testTree(defaultFilter);

exports.treeClasses = treeClasses;