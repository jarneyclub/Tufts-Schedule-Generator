const Permutations = require('../services/generateCourseSchedule/utils/permutationsUtils.js');
const sequences = require('../services/generateCourseSchedule/utils/sequenceSystem.js');

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const testPermutationsDPThirtyTwo = () => {
    console.log("--- unit test ( Dynamic Programming Permutations ( 32 possible digit index exists) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [6, 4, 10, 32, 32, 10, 0, 4];
    for (let index in digitsArray)
        expectedSize *= (digitsArray[index] + 1);

    let output = Permutations.permutationsDP(digitsArray);
    if (output.length == expectedSize)
        result = true;
    else {
        result = false;
        console.log("expected size: ", expectedSize);
        console.log("output.length: ", output.length);
        console.log("input: ", digitsArray);
        console.log("output: ", output);
        console.log("Error in testPermutationsDPUnsortedThree")
    }

    return result;
}

const testSeqSys = () => {
    console.log("--- unit test ( Sequence System ( 32 possible digit index exists) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [6, 4, 10, 32, 32, 10, 0, 4];
    for (let index in digitsArray)
        expectedSize *= (digitsArray[index] + 1);

    let sys = sequences.sequenceSys();
    sys.init(digitsArray);
    let output = [];
    for (let i = 0 ; i < expectedSize; i++) {
        try {
            output.push(sys.getCurr());
            sys.increment();
        }
        catch (e) {
            console.error("ahhhhh")
            break;
        }
    }

    if (output.length == expectedSize)
        result = true;
    else {
        result = false;
        console.log("expected size: ", expectedSize);
        console.log("output.length: ", output.length);
        // console.log("input: ", digitsArray);
        // console.log("output: ", output);
        console.log("Error in testSeqSys")
    }

    return result;
}

const test = () => {
    var start = Date.now(); // begin timing 

    // testPermutationsDPThirtyTwo();
    testSeqSys();
    
    var end = Date.now(); // End timing
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";
    console.log(timeTakenString)

    // start = Date.now(); // begin timing 
    // testPermutationsDPThirtyTwo();
    // end = Date.now(); // End timing
    // difference = end - start;
    // timeTakenString = difference.toString() + "ms";
    // console.log(timeTakenString)
}

test();