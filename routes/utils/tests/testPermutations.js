const Permutations = require('../permutations.js');

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const testPermutationsDPSorted = () => {
    console.log("--- unit test ( Dynamic Programming Permutations ( INCREASING TO DECREASING SORTED ARRAY) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [4,3,1];
    for (let index in digitsArray)
        expectedSize*=digitsArray[index];

    let output = Permutations.permutationsDP(digitsArray);
    if (output.length == expectedSize)
        result = true;
    else
        result = false;

    return result;
}

const testPermutationsDPUnsortedOne = () => {
    console.log("--- unit test ( Dynamic Programming Permutations (UNSORTED ARRAY 1) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [1, 3, 4];
    for (let index in digitsArray)
        expectedSize *= digitsArray[index];

    let output = Permutations.permutationsDP(digitsArray);
    if (output.length == expectedSize)
        result = true;
    else
        result = false;

    return result;
}

const testPermutationsDPUnsortedTwo = () => {
    console.log("--- unit test ( Dynamic Programming Permutations (UNSORTED ARRAY 2) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [4, 3, 4];
    for (let index in digitsArray)
        expectedSize *= digitsArray[index];

    let output = Permutations.permutationsDP(digitsArray);
    if (output.length == expectedSize)
        result = true;
    else
        result = false;

    return result;
}

const testPermutationsDPUnsortedThree = () => {
    console.log("--- unit test ( Dynamic Programming Permutations (UNSORTED ARRAY 3) ) ---")

    let result = false;
    let expectedSize = 1;

    /* INITIALIZE INPUT */
    let digitsArray = [4, 9, 4, 5, 6];
    for (let index in digitsArray)
        expectedSize *= digitsArray[index];

    let output = Permutations.permutationsDP(digitsArray);
    if (output.length == expectedSize)
        result = true;
    else
        result = false;

    return result;
}

const testPermutations = () => {
    console.log("### Testing Permutations ###");
    let testResults = [];
    testResults.push(testPermutationsDPSorted());
    testResults.push(testPermutationsDPUnsortedOne());
    testResults.push(testPermutationsDPUnsortedTwo());
    testResults.push(testPermutationsDPUnsortedThree());
    
    let testsPass = true;
    for (let index in testResults) {
        if (testResults[index] == false) {
            testsPass = false;
        }
    }

    if (testsPass == true)
        console.log("PermutationsUtils passed all tests")
    else
        console.log("PermutationsUtils DID NOT pass all tests")
}

testPermutations();