const Node = require('./objects/Tree2Node.js');
const treeify = require('treeify');
/*
    Definition for Tree2
    Type: AVL Tree
    Usage: Checking if a week of Classes has any overlapping time periods
    Key: start time of a Class
    Node: * Node * from Tree2Node.js 
    Note:
    - implemented with "pointers"

    USAGE:
    
    Node CONSTRUCTION:
        // assume class is a Class object
        var newNode = new Node(class, class.getSectionName(), class.getDayOfWeek() * 2400 + class.getStartTime(), 
                                    class.getDayOfWeek() * 2400 + class.getEndTime() );
    Node COMPARISON:
        if (node1.getValue() > node2.getValue())
            ....
*/

/**
 * 
 * 
 * @returns 
 */
function Tree2() {

    // 1-indexed
    var root = null;
    var treeSize = 0;


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

    /** Insert a Class object into the AVL Tree
     * 
     * @param {Class} inputObject 
     */
    const insert = (inputObject) => {
        
        // day * 2400 + time so that all classes in a week can be inserted into one AVL tree
        let inputLeftValue = inputObject.getDayOfWeek() * 2400 + inputObject.getStartTime();
        let inputRightValue = inputObject.getDayOfWeek() * 2400 + inputObject.getEndTime();
        let inputName = inputObject.getSectionName();
        // console.log("INSERTION NODE INFO: ");
        // console.log("inserting ", inputName);
        // console.log("inputLeftValue: ", inputLeftValue);
        // console.log("inputRightValue: ", inputRightValue);

        // console.log("QUERY INTERVAL CHECKING BEGIN: ");
        if (queryIntervalHelper(inputLeftValue, inputRightValue, root) == false) {
            // console.log("INSERTION BEGIN: ");
            root = insertHelper(inputObject, inputName, inputLeftValue, inputRightValue, root, 0);
        }

    }

    const print = (option) => {
        let nodesArray = [];

        if (option == "inorder") {
            inOrderPrintHelper(root, nodesArray);
            let printArray = [];
            for (let index in nodesArray)
                printArray.push(nodesArray[index].getLeftValue());
            console.log(" Tree2 (InOrder Print): ", printArray);
        }
        else if (option == "inorderName") {
            inOrderPrintHelper(root, nodesArray);
            let printArray = [];
            for (let index in nodesArray)
                printArray.push(nodesArray[index].getName());
            console.log(" Tree2 (InOrder Name Print): ", printArray);
        }
        else if (option == "tree") {
            console.log(treeify.asTree({ root }, true, true));
        }
        else if (option == "array") {
            let treeArray = [undefined];
            treeArrayHelper(root, 1, treeArray, getHeight(root));
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
    // section, startTime, currNode, depth
    const insertHelper = (inputObject, inputName, inputLeftValue, inputRightValue, currNode, depth) => {

        /* BST insertion start */

        // BASE CASE: input node is null, start unraveling recursion
        if (currNode == null) {

            // augmentation of leaf is (leftValue, rightValue)
            var newNode = new Node(inputObject, inputName, inputLeftValue, inputRightValue, inputRightValue);

            treeSize++;

            return newNode;
        }
        else {
            
            // update currNode augmentation 
            if (currNode.getSpan() < inputRightValue) {
                // console.log("augmenting ", currNode.getName(), " with ", inputRightValue);
                currNode.setSpan(inputRightValue);
            }
            
            // insert in left subtree
            if (currNode.getLeftValue() > inputLeftValue) {    

                currNode.left = insertHelper(inputObject, inputName, inputLeftValue, inputRightValue, currNode.left, depth + 1);
            }
            // insert in right subtree
            else if (currNode.getLeftValue() < inputLeftValue) {

                currNode.right = insertHelper(inputObject, inputName, inputLeftValue, inputRightValue, currNode.right, depth + 1);
            }
            // currNode.getLeftValue() == startTime
            else {
                throw new Error('Request object could not be inserted as a Node with an identical value already exists');
            }

        }
        /* BST insertion end */

        /* AVL invariant maintenance start */

        currNode.height = max(getHeight(currNode.left), getHeight(currNode.right)) + 1;

        currNode = balanceNode(currNode);

        /* AVL invariant maintenance end */

        return currNode;
    }

    /** check if query interval intersects with any node in AVL Tree
     * @param {any} inputLeftValue 
     * @param {any} inputRightValue 
     * @param {any} currNode 
     * @returns {boolean} whether node intersects or not
     */
    const queryIntervalHelper = (inputLeftValue, inputRightValue, currNode) => {

        if (currNode == null) {
            // console.log("currNode is null")
            /* currNode does not exist */
            return false;
        }
        
        let leftCurrNodeSpan = currNode.getLeftValue();
        let rightCurrNodeSpan = currNode.getSpan();
        let currNodeRightValue = currNode.getRightValue();
        
        /* check if node intersects with subtree root */

        if (doesNotOverlap(inputLeftValue, inputRightValue, leftCurrNodeSpan, currNodeRightValue) == true) {
            
            // console.log("input does not overlap with currNode");

            /* node to insert DOES NOT overlap with currNode */

            // check if node intersects with subtree root's span
            if (doesNotOverlap(inputLeftValue, inputRightValue, leftCurrNodeSpan, rightCurrNodeSpan) == true) {
                /* node to insert DOES NOT overlap with currNode's span */
                
                // console.log("does not overlap with currNode's span");
                
                // query interval is to the right of span
                if (rightCurrNodeSpan < inputLeftValue) {

                    /* no possible intersection in subtree */

                    // console.log("inputLeftValue: ", inputLeftValue);
                    // console.log("inputRightValue: ", inputRightValue);
                    // console.log("rightCurrNodeSpan: ", rightCurrNodeSpan);
                    // console.log("CASE 1A: no possible intersection in subtree");
                    
                    return false;
                }
                // query interval is to the left of span
                else if (inputLeftValue < leftCurrNodeSpan && inputRightValue < leftCurrNodeSpan) {

                    // console.log("query interval is to the left of span");
                    // console.log("CASE 1B: recurse to left subtree");
                    return queryIntervalHelper(inputLeftValue, inputRightValue, currNode.left);
                }
            }
            else {
                /* node to insert DOES overlap with currNode's span */
                // console.log("does overlap with currNode's span");

                if (currNode.left == null) {
                    return queryIntervalHelper(inputLeftValue, inputRightValue, currNode.right);
                }
                else {
                    let leftSubtreeSpan = currNode.left.getSpan();
                    let leftSubtreeValue = currNode.left.getLeftValue();
                    // does not intersect with left subtree
                    if (doesNotOverlap(leftSubtreeValue, leftSubtreeSpan, inputLeftValue, inputRightValue) == true) {
                        // console.log("does not overlap with currNode.left's span");

                        // console.log("CASE 2: recurse to right subtree");
                        /* recurse to right subtree */
                        return queryIntervalHelper(inputLeftValue, inputRightValue, currNode.right);
                    }
                    else {
                        // console.log("does overlap with currNode.left's span");

                        // console.log("CASE 2: recurse to left subtree");
                        /* recurse to left subtree */
                        return queryIntervalHelper(inputLeftValue, inputRightValue, currNode.left);
                    }
                }
                
            }

        }
        else {
            /* node to insert DOES overlap with currNode */
            // console.log("input does overlap with currNode");
            return true;
        }
    }

    /** O(1) comparison
     * 
     * @param {any} beginA 
     * @param {any} endA 
     * @param {any} beginB 
     * @param {any} endB 
     * @returns 
     */
    const doesNotOverlap = (beginA, endA, beginB, endB) => {
        if ((beginA <= beginB && beginB <= endA) || (beginB <= beginA && beginA <= endB)) {
            return false;
        }
        else {
            return true;
        }
    }

    /** Balance a given AVL Tree node
     * Callers: insertHelper
     * @param {any} currNode will always be != null 
     * @returns 
     */
    const balanceNode = (currNode) => {

        // currNode is left heavy
        if (heightDiff(currNode) < -1) {

            // Check for need to do double rotation
            if (heightDiff(currNode.left) >= 1) {
                currNode.left = leftRotate(currNode.left)
            }

            currNode = rightRotate(currNode);
        }
        // currNode is right heavy
        else if (heightDiff(currNode) > 1) {

            // Check for need to do double rotation
            if (heightDiff(currNode.right) <= -1) {
                currNode.right = rightRotate(currNode.right);
            }

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
            console.log("LEFT ROTATING node: ", currNode.getName());
            let rightLeftSubtree = currNode.right.left;
            let rightSubtree = currNode.right;
            let newNode = null;

            currNode.right = rightLeftSubtree;
            rightSubtree.left = currNode;
            newNode = rightSubtree;
            
            // Note: newNode.left is always != null because it switched with what is now newNode
            newNode.left.height = max(getHeight(newNode.left.left), getHeight(newNode.left.right)) + 1;

            newNode.height = max(getHeight(newNode.left), getHeight(newNode.right)) + 1;

            console.log("newNode: ", newNode.getName());
            if (newNode.left != null)
                console.log("newNode.left: ", newNode.left.getName());
            if (newNode.right != null)
                console.log("newNode.right: ", newNode.right.getName());

            return newNode;

        }
        catch (e) {
            console.log("Error in leftRotate. Details: ");
            console.log(e);
            console.log("currNode: ", currNode.getName());
            if (currNode.left != null)
                console.log("currNode.left: ", currNode.left.getName());
            if (currNode.right != null)
                console.log("currNode.right: ", currNode.right.getName());
        }

    }

    const rightRotate = (currNode) => {
        try {
            console.log("RIGHT ROTATING node: ", currNode.getName());
            let leftRightSubtree = currNode.left.right;
            let leftSubtree = currNode.left;
            let newNode = null;

            currNode.left = leftRightSubtree
            leftSubtree.right = currNode;
            newNode = leftSubtree;

            // Note: newNode.right is always != null because it switched with what is now newNode
            newNode.right.height = max(getHeight(newNode.right.left), getHeight(newNode.right.right)) + 1;

            newNode.height = max(getHeight(newNode.left), getHeight(newNode.right)) + 1;

            console.log("newNode: ", newNode.getName());
            if (newNode.left != null)
                console.log("newNode.left: ", newNode.left.getName());
            if (newNode.right != null)
                console.log("newNode.right: ", newNode.right.getName());

            return newNode;
        }
        catch (e) {
            console.log("Error in rightRotate. Details: ");
            console.log(e);
            console.log("currNode: ", currNode.getName());
            if (currNode.left != null)
                console.log("currNode.left: ", currNode.left.getName());
            if (currNode.right != null)
                console.log("currNode.right: ", currNode.right.getName());
        }
    }

    const max = (a, b) => {
        if (a <= b)
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

    const treeArrayHelper = (currNode, index, treeArray, height) => {
        if (height == 0) {

            if (currNode == null) {
                treeArray[index] = null;

                return;
            }
            else {
                treeArray[index] = currNode.getName();

                return;
            }
        }
        else {
            if (currNode == null) {
                treeArray[index] = null;

                // go to left subtree
                treeArrayHelper(null, 2 * index, treeArray, height - 1);
                // go to right subtree
                treeArrayHelper(null, 2 * index + 1, treeArray, height - 1);
            }
            else {
                treeArray[index] = currNode.getName();
                // go to left subtree
                treeArrayHelper(currNode.left, 2 * index, treeArray, height - 1);
                // go to right subtree
                treeArrayHelper(currNode.right, 2 * index + 1, treeArray, height - 1);
            }
        }
    }

    const inOrderPrintHelper = (currNode, array) => {
        if (currNode != null) {

            inOrderPrintHelper(currNode.left, array); // recurse to left subtree

            array.push(currNode);

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

module.exports = Tree2;