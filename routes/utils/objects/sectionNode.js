const Section = require('./classes/Section.js');

/** Node for AVL tree of Sections
 * Key: Section
 * Value: Start time of Section
 * Augmentation: Span of subtree (node.value, node.right's rightmost value)
 * 
 * @param {Section} sectionInput 
 * @param {array} spanInput array of integers of size 2. 
 */
function Node (sectionInput, spanInput) {
    var section = sectionInput;
    
    var value = sectionInput.getStartTime();
    var left = undefined;
    var right = undefined;
    var span = spanInput; // Augmentation 

    return {
        section: section,
        value: value,
        left: left,
        right: right,
        span: span
    }
}

module.exports = Node;