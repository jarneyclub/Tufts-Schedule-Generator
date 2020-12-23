const Tree2 = require('../Tree2.js');
const Class = require('../objects/classes/Class.js');

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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 2, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 3, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "D", "testSec", 4, 7, 15, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "E", "testSec", 5, 7, 15, "test location", "test city", ["test instructor"]))

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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "B", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "A", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))

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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "B", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "A", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))

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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 500, 700, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 200, 400, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 900, 1100, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "D", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "E", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "D", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "E", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "D", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "E", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 600, 650, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 200, 250, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 400, 450, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "D", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "E", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
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
    let tree = new Tree2();

    /* INITIALIZE OBJECTS TO INSERT */
    let testObjects = [];
    testObjects.push(new Class("Test", "A", "testSec", 1, 300, 350, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "B", "testSec", 1, 100, 150, "test location", "test city", ["test instructor"]))
    testObjects.push(new Class("Test", "C", "testSec", 1, 50, 90, "test location", "test city", ["test instructor"]))
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


const testTree2 = () => {
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

    let testsPass = true;
    for (let index in testResults) {
        if (testResults[index] == false) {
            testsPass = false;
        }
    }

    if (testsPass == true)
        console.log("Tree2 passed all tests")
    else
        console.log("Tree2 DID NOT pass all tests")


}

exports.testTree2 = testTree2;