/*
    Node definition for TREE2
    !!!!
    To be used in AVL tree that represents a week of Classes, with each node representing a Class
    - Augmented
    !!!!

    Handling duplicates:
    - THIS DOES NOT HANDLE DUPLICATES AS TREE2'S INVARIANT IS NO OVERLAPS

    USAGE:
    Node Construction:
        // assume sec is a Section object
        var newNode = new Node(sec);
    Node comparison:
        if (node1.getValue() > node2.getValue())
    Node duplicate section insertion
        node.storeObject(sec)

*/

/**
 * 
 * 
 * @param {any} inputObject 
 * @param {any} inputName 
 * @param {any} inputLeft 
 * @param {any} inputRight 
 * @param {any} inputAugmentation 
 * @returns 
 */
function nodeTreeClasses(inputObject, inputName, inputLeft, inputRight, inputAugmentation) {

    var object = inputObject;
    // var value = inputValue;
    var span = inputAugmentation;
    var name = inputName;
    var height = 0;
    var left = null;
    var right = null;

    var leftEndpoint = inputLeft;
    var rightEndpoint = inputRight;

    // const getValue = () => {
    //     return value;
    // }

    const getLeftValue = () => {
        return leftEndpoint;
    }

    const getRightValue = () => {
        return rightEndpoint;
    }

    /**
     * @returns {object} stored object
     */
    const getObject = () => {
        return object;
    }

    const getSpan = () => {
        return span;
    }

    const getName = () => {
        return name;
    }

    const setSpan = (input) => {
        span = input;
    }


    return {
        getObject: getObject,
        getSpan: getSpan,
        getName: getName,
        getLeftValue: getLeftValue,
        getRightValue: getRightValue,
        setSpan: setSpan,
        leftEndpoint: leftEndpoint,
        span: span,
        left: left, 
        right: right,
        height: height,
        name: name
    }
}

module.exports = nodeTreeClasses;