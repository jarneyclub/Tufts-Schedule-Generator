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
        console.log("inserting node: ", section.getSectionName());
        courseID = section.getCourseID();
        sectionType = section.getSectionType();

        var startTime = section.getStartTime();
        insertHelper(section, startTime, root, 0);
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

        // insert a new Node as a root
        if (currNode == null) {
            var newNode = new sectionsNode(section);
            // inesrt root
            if (root == null) {
                root = newNode;
            }
            // check shape property and rotate as needed
            treeSize++;
        }
        else {
            // insert in left subtree
            if (currNode.getValue() > startTime) {
                if (currNode.left == null) {
                    var newNode = new sectionsNode(section);
                    currNode.left = newNode;
                }
                else {
                    // recurse into left subtree
                    insertHelper(section, startTime, currNode.left, depth + 1);
                }
            }
            // insert in right subtree
            else if (currNode.getValue() < startTime) {
                if (currNode.right == null) {
                    var newNode = new sectionsNode(section);
                    currNode.right = newNode;
                }
                else {
                    // recurse into right subtree
                    insertHelper(section, startTime, currNode.right, depth + 1);
                }
            }
            // value of current node is same as start time of section to insert
            else {
                currNode.storeObject(section); // handle duplicates
            }
        }
        /* BST insertion end */

        /* AVL invariant maintenance start */
        if (currNode != null) {
            
            console.log("currNode: ", currNode.getObjects()[0].getSectionName());
            
            /* Balancing subtrees */
            if (currNode.left != null)
                console.log("balancing currNode.left: ", currNode.left.getObjects()[0].getSectionName());
            currNode.left = balanceNode(currNode.left);
            if (currNode.right != null)
                console.log("balancing currNode.right: ", currNode.right.getObjects()[0].getSectionName());
            currNode.right = balanceNode(currNode.right);

            /* Updating Height */
            currNode.height = max(getHeight(currNode.left), getHeight(currNode.right)) + 1;
        }
        /* AVL invariant maintenance end */
    }

    const balanceNode = (childNode) => {
        let newNode = null;
        
        if (childNode != null) {

            // childNode is left heavy
            if (heightDiff(childNode) < -1) {
                console.log("subtree is left heavy");
                newNode = rightRotate(childNode);
            }
            // childNode is right heavy
            else if (heightDiff(childNode) > 1) {
                console.log("subtree is right heavy");
                newNode = leftRotate(childNode);
            }
            // childNode is balanced
            else {
                newNode = childNode;
            }

            /* Updating Height */
            newNode.height = max(getHeight(newNode.left), getHeight(newNode.right)) + 1;
            
            return newNode;
        }
        else {
            return newNode;
        }
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

    const levelOrderPrintHelper = (currNode, array, level) => {
        if (currNode == null) {
            // push "null" to array at current level
            array[level].push(null)
        }
        else if (currNode == undefined) {
            return;
        }
        else {
            array.push(currNode)
        }
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
        leftRotate: leftRotate,
        rightRotate: rightRotate,
        print: print
    }
}

module.exports = Tree1;