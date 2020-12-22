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
 * @param {any} inputValue 
 * @param {any} inputAugmentation 
 * @returns 
 */
function Tree2Node(inputObject, inputName, inputValue, inputAugmentation) {

    var object = inputObject;
    var value = inputValue;
    var span = inputAugmentation;
    var name = inputName;
    var height = 0;
    var left = null;
    var right = null;


    const getValue = () => {
        return value;
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


    return {
        getValue: getValue,
        getObject: getObject,
        getSpan: getSpan,
        getName: getName,
        getValue: getValue,
        left: left, 
        right: right,
        height: height,
        value: value,
        name: name
    }
}

module.exports = Tree2Node;