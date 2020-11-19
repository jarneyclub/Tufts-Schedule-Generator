const sectionsNode = require('./objects/Tree1Node.js');
/*
    definition for Tree1
    Type: AVL Tree
    Key: start time of a section
    Node: * sectionsNode * from Tree1Node.js 
    Note:
    - handles duplicates
    - takes sections as inputs ( converts to sectionsNode )

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
    var tree = [null];
    var treeSize = 0;
    var courseID = "";
    var sectionType = "";

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////
    const getRoot = () => {
        return tree[1];
    }

    const isEmpty = () => {
        if (treeSize == 0 )
            return true
        else 
            return false
    }

    const insert = (section) => {
        courseID = section.getCourseID();
        sectionType = section.getSectionType();

        var startTime = section.getStartTime();
        insertHelper(section, startTime, 1);
    }

    const print = () => {
        var printArray = [];
        preOrderPrintHelper(1, printArray);

        console.log("Course: ", courseID, " secType: ", sectionType, " tree: ", printArray);
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
    const insertHelper = (section, startTime, index) => {

        // insert a new Node as a leaf in tree
        if (tree[index] == undefined) {
            var node = new sectionsNode(section); // create sectionsNode

            tree[index] = node; // insert leaf
            treeSize++; // increment treeSize
        }
        else {
            // recurse into left subtree
            if (tree[index].getValue() > startTime) {
                var leftIndex = leftChildIndex(index); // get index of left child

                insertHelper(section, startTime, leftIndex); // recurse
            }
            // recurse into right subtree
            else if (tree[index].getValue() < startTime) {
                var rightIndex = rightChildIndex(index); // get index of right child

                insertHelper(section, startTime, rightIndex); // recurse
            }
            // value of current node is same as start time of section to insert
            else
                tree[index].storeObject(section); // handle duplicates
        }
    }
    
    const preOrderPrintHelper = (index, array) => {
        if ( indexInRange(index) == true && tree[index] != undefined ) {
            // recurse left
            var leftIndex = leftChildIndex(index);
            preOrderPrintHelper(leftIndex, array);

            // handle duplicates
            if (tree[index].noDuplicates() == true) {
                array.push(tree[index].getValue());
            }
            else {
                var duplicates = tree[index].getObjects();
                for (let dupInd in duplicates) {
                    array.push(tree[index].getValue());
                }
            }
            
            // recurse right
            var rightIndex = rightChildIndex(index);
            preOrderPrintHelper(rightIndex, array);
        }
    }

    const indexInRange = (index) => {
        if (index <= treeSize)
            return true;
        else {
            return false;
        }
    }

    const leftChildIndex = (index) => {
        return index * 2;
    }

    const rightChildIndex = (index) => {
        return index * 2 + 1;
    }

    return {
        getRoot: getRoot,
        isEmpty: isEmpty,
        insert: insert,
        print: print
    }
}

module.exports = Tree1;