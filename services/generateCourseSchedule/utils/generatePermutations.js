const Permutations = require('./permutationsUtils.js');
const CountingSort = require('./countingsortUtils.js');

const generatePermutations = (global) => {
    return new Promise ((resolve, reject) => {
        
        let possibleDigits = global.possibleDigits;
        let arrayCourses = global.arrayCourses;
        let filter = global.filter;

        console.log("possibleDigits: ", possibleDigits)
        console.log("arrayCourses: ", arrayCourses)
        console.log("filter: ", filter);
        
        let start = Date.now();

        /* (only when using dynamic programming) perform counting sort on possibleDigits for more consistent memoisation */
        let sortedObject = CountingSort.countingSort(possibleDigits, 31);
        let sortedDigits = sortedObject.sorted; // permutations will run on this array of integers
        let references = sortedObject.references; // a map of indices in which entry in index e is the index in chosenSectionType (list of sections)

        /* get permutations */
        let chosenPermutations = Permutations.getPermutations(sortedDigits); //used 

        let end = Date.now();
        let difference = end - start;
        let timeTakenString = difference.toString() + "ms";
        console.log("(api/courses/schedule):", "generatePermutations() took: ", timeTakenString);
        
        /* add global variables */
        global.references = references;
        global.chosenPermutations = chosenPermutations;

        resolve(global);
    });
}

module.exports = generatePermutations;