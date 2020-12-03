const Section = require('./classes/Section.js');
/*
    Node definition for AVL tree
    !!!!
    To be used in tree that represents SECTIONS IN A SECTION TYPE
    - Not augmented
    !!!!

    Handling duplicates:
    - Section's with the same start times are appended in a list

    USAGE:
    Node Construction:
        // assume sec is a Section object
        var newNode = new Node(sec);
    Node comparison:
        if (node1.getValue() > node2.getValue())
    Node duplicate section insertion
        node.storeObject(sec)

*/

function Tree2Node(sectionInput) {

    var value = sectionInput.getStartTime();
    var span = sectionInput.getEndTime();
    /* array of duplicates that have the same value */
    var objects = [];

    const getValue = () => {
        return value;
    }

    /** store any object in objects
     * @param {any} object 
     */
    const storeObject = (object) => {
        objects.push(object);
    }

    /**
     * O(1)
     * @returns {Array} array of objects
     */
    const getObjects = (objects) => {
        return objects;
    }

    /**
     * @returns {Boolean} whether there are duplicates or not
     */
    const noDuplicates = () => {
        if (objects.length == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    const getSpan = () => {
        return span;
    }

    return {
        getValue: getValue,
        storeObject: storeObject,
        getObjects: getObjects,
        getSpan: getSpan,
        noDuplicates: noDuplicates,
        value: value,
        objects: objects
    }
}

module.exports = Tree2Node;