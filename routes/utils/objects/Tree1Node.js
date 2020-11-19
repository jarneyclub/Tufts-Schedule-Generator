const Section = require('./classes/Section.js');
/*
    Node definition for AVL tree
    !!!!
    To be used in tree that represents SECTIONS IN A SECTION TYPE
    - Not augmented
    !!!!

    USAGE:
    Node CONSTRUCTION:
        // assume sec is a Section object
        var newNode = new Node(sec);
    Node COMPARISON:
        if (node1.getValue() > node2.getValue())
            ....
    Node DUPLICATE HANDLING
        let sec <- section to insert
        if (sec.getStartTime() == existingNode.getValue()) {
            existingNode.storeObject(sec);
        }
*/

function Tree1Node(sectionInput) {

    var value = sectionInput.getStartTime();
    var course = sectionInput.getCourseID();
    
    /* array of duplicates that have the same value */
    // elts are Section objects
    var objects = [sectionInput];

    const getValue = () => {
        return value;
    }
    
    const getCourseID = () => {
        return course;
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
    const getObjects = () => {
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

    return {
        getValue: getValue,
        storeObject: storeObject,
        getObjects: getObjects,
        noDuplicates: noDuplicates,
        getCourseID: getCourseID,
        value: value,
        objects: objects
    }
}

module.exports = Tree1Node;