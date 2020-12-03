const sectionsNode = require('./objects/Tree1Node.js');
const treeify = require('treeify');
/*
    definition for Tree1
    Type: AVL Tree
    Key: start time of a section
    Node: * sectionsNode * from Tree1Node.js 
    Note:
    - handles duplicates
    - takes sections as inputs ( converts to sectionsNode )
    - implemented with "pointers"

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

/**
 * 
 * 
 * @returns 
 */
function Tree1() {

    // 1-indexed
    var root = null;
    var treeSize = 0;
    var courseID = "";
    var sectionType = "";


    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    const getRoot = () => {
        return root;
    }

    const isEmpty = () => {
        if (treeSize == 0)
            return true
        else
            return false
    }

    const insert = (section) => {
        courseID = section.getCourseID();
        sectionType = section.getSectionType();

        let startTime = section.getStartTime();
        root = insertHelper(section, startTime, root, 0);
    }

    const print = (option) => {
        let sectionsArray = [];

        if (option == "inorder") {
            inOrderPrintHelper(root, sectionsArray);
            let printArray = [];
            for (let index in sectionsArray)
                printArray.push(sectionsArray[index].getStartTime());
            console.log("Course: ", courseID, " secType: ", sectionType, " tree: ", printArray);
        }
        else if (option == "inorderSecName") {
            inOrderPrintHelper(root, sectionsArray);
            let printArray = [];
            for (let index in sectionsArray)
                printArray.push(sectionsArray[index].getSectionName());
            console.log("Course: ", courseID, " secType: ", sectionType, " tree: ", printArray);
        }
        else if (option == "tree") {
            console.log(treeify.asTree({root}, true, true));
        }
        else if (option == "array") {
            let treeArray = [undefined];
            treeArrayHelper(root, 1, treeArray);
            return treeArray;
        }
    }


    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    /** AVL Insert
     *  Base case: the position at index is undefined, insert node
     *  Compare node values and insert node in tree as leaf
     * @param {any} section
     * @param {any} index 
     */
    const insertHelper = (section, startTime, currNode, depth) => {

        /* BST insertion start */

        // BASE CASE: input node is null, start unraveling recursion
        if (currNode == null) {
            var newNode = new sectionsNode(section);

            treeSize++; 
            
            return newNode;
        }
        else {
            // insert in left subtree
            if (currNode.getValue() > startTime) {

                currNode.left = insertHelper(section, startTime, currNode.left, depth + 1);
            }
            // insert in right subtree
            else if (currNode.getValue() < startTime) {

                currNode.right = insertHelper(section, startTime, currNode.right, depth + 1);            
            }
            // currNode.getValue() == startTime
            else {
                currNode.storeObject(section); // handle duplicates
            }

        }
        /* BST insertion end */

        /* AVL invariant maintenance start */

        currNode.height = max(getHeight(currNode.left), getHeight(currNode.right)) + 1;        

        currNode = balanceNode(currNode);

        /* AVL invariant maintenance end */

        return currNode;
    }

    /** Balance a given AVL Tree node
     * Callers: insertHelper
     * @param {any} currNode will always be != null 
     * @returns 
     */
    const balanceNode = (currNode) => {

        // currNode is left heavy
        if (heightDiff(currNode) < -1) {

            currNode = rightRotate(currNode);
        }
        // currNode is right heavy
        else if (heightDiff(currNode) > 1) {

            currNode = leftRotate(currNode);
        }
        // currNode is balanced
        else {
            return currNode;
        }

        return currNode;
    }


    const leftRotate = (currNode) => {
        try {
            console.log("LEFT ROTATING node: ", currNode.getObjects()[0].getSectionName());
            let rightLeftSubtree = currNode.right.left;
            let rightSubtree = currNode.right;
            let newNode = null;

            currNode.right = rightLeftSubtree;
            rightSubtree.left = currNode;
            newNode = rightSubtree;
            
            // Note: newNode.left is always != null because it switched with what is now newNode
            newNode.left.height = max(getHeight(newNode.left.left), getHeight(newNode.left.right)) + 1;

            console.log("newNode: ", newNode.getObjects()[0].getSectionName());
            if (newNode.left != null)
                console.log("newNode.left: ", newNode.left.getObjects()[0].getSectionName());
            if (newNode.right != null)
                console.log("newNode.right: ", newNode.right.getObjects()[0].getSectionName());

            return newNode;

        }
        catch (e) {
            console.log("Error in leftRotate. Details: ");
            console.log(e);
            console.log("currNode: ", currNode.getObjects()[0].getSectionName());
            console.log("currNode.left: ", currNode.left.getObjects()[0].getSectionName());
            console.log("currNode.right: ", currNode.right.getObjects()[0].getSectionName());
        }

    }
    const rightRotate = (currNode) => {
        try {
            console.log("RIGHT ROTATING node: ", currNode.getObjects()[0].getSectionName());
            let leftRightSubtree = currNode.left.right;
            let leftSubtree = currNode.left;
            let newNode = null;

            currNode.left = leftRightSubtree
            leftSubtree.right = currNode;
            newNode = leftSubtree;
            
            // Note: newNode.right is always != null because it switched with what is now newNode
            newNode.right.height = max(getHeight(newNode.right.left), getHeight(newNode.right.right)) + 1;

            console.log("newNode: ", newNode.getObjects()[0].getSectionName());
            if (newNode.left != null)
                console.log("newNode.left: ", newNode.left.getObjects()[0].getSectionName());
            if (newNode.right != null)
                console.log("newNode.right: ", newNode.right.getObjects()[0].getSectionName());

            return newNode;
        }
        catch(e) {
            console.log("Error in rightRotate. Details: ");
            console.log(e);
            console.log("currNode: ", currNode.getObjects()[0].getSectionName());
            console.log("currNode.left: ", currNode.left.getObjects()[0].getSectionName());
            console.log("currNode.right: ", currNode.right.getObjects()[0].getSectionName());
        }
    }

    const max = (a,b) => {
        if ( a <= b )
            return b;
        else 
            return a;
    }
    
    const getHeight = (node) => {
        if (node != null)
            return node.height;
        else
            return -1;
    }

    const heightDiff = (currNode) => {
        var leftHeight = getHeight(currNode.left);
        var rightHeight = getHeight(currNode.right);
        return rightHeight - leftHeight;
    }

    const treeArrayHelper = (currNode, index, treeArray) => {
        if (currNode == null) {
            treeArray[index] = null;

            return;
        }

        treeArray[index] = currNode.getObjects()[0].getSectionName();
        // go to left subtree
        treeArrayHelper(currNode.left, 2*index, treeArray);
        // go to right subtree
        treeArrayHelper(currNode.right, 2 * index + 1, treeArray);
    }

    const inOrderPrintHelper = (currNode, array) => {
        if (currNode != null) {

            inOrderPrintHelper(currNode.left, array); // recurse to left subtree

            let duplicates = currNode.getObjects();
            for (let index in duplicates) {
                array.push(duplicates[index]);
            }

            inOrderPrintHelper(currNode.right, array); // recurse to right subtree

        }
    }

    return {
        getRoot: getRoot,
        isEmpty: isEmpty,
        insert: insert,
        print: print
    }
}

module.exports = Tree1;