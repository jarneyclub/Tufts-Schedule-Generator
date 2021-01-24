const LARGEST_POSSIBLE_DIGIT_DP = 31;

const tenToThirtyTwo = {
    0:  "A",
    1:  "B",
    2:  "C",
    3:  "D",
    4:  "E",
    5:  "F",
    6:  "G",
    7:  "H",
    8:  "I",
    9:  "J",
    10: "K",
    11: "L",
    12: "M",
    13: "N",
    14: "O",
    15: "P",
    16: "Q",
    17: "R",
    18: "S",
    19: "T",
    20: "U",
    21: "V",
    22: "W",
    23: "X",
    24: "Y",
    25: "Z",
    26: "2",
    27: "3",
    28: "4",
    29: "5",
    30: "6",
    31: "7"
};

const memo = {
    "A" : [[0]],
    "B" : [[1], [0]],
    "C" : [[2], [1], [0]],
    "D" : [[3], [2], [1], [0]],
    "E" : [[4], [3], [2], [1], [0]],
    "F" : [[5], [4], [3], [2], [1], [0]],
    "G" : [[6], [5], [4], [3], [2], [1], [0]],
    "H" : [[7], [6], [5], [4], [3], [2], [1], [0]],
    "I" : [[8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "J" : [[9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "K" : [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "L" : [[11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "M" : [[12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "N" : [[13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "O" : [[14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "P" : [[15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "Q" : [[16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "R" : [[17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "S" : [[18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "T" : [[19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "U" : [[20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "V" : [[21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "W" : [[22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "X" : [[23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "Y" : [[24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "Z" : [[25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "2" : [[26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "3" : [[27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "4" : [[28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "5" : [[29], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "6" : [[30], [20], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]],
    "7" : [[31], [30], [29], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]]
};

/** Generates all possible permutations of a given array of digits
 * IMPORTANT: ONLY SUPPORTS DIGITS [0-31]
 * O(n*k^n) NOT TIGHT
 * @param {array} arrayDigits array of digits that is 0 to 9
 * e.g. [3,1], expecting [[3,1], [2,1], [1,1]]
 * @returns 
 */
const permutationsDP = (arrayDigits) => {

    console.log("memo size: ", Object.keys(memo).length )

    // identify base cases
    // memo["A"] = [[0]]
    // memo["B"] = [[1], [0]];
    // memo["C"] = [[2], [1], [0]];
    // memo["D"] = [[3], [2], [1], [0]];
    // memo["E"] = [[4], [3], [2], [1], [0]];
    // memo["F"] = [[5], [4], [3], [2], [1], [0]];
    // memo["G"] = [[6], [5], [4], [3], [2], [1], [0]];
    // memo["H"] = [[7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["I"] = [[8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["J"] = [[9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["K"] = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["L"] = [[11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["M"] = [[12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["N"] = [[13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["O"] = [[14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["P"] = [[15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["Q"] = [[16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["R"] = [[17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["S"] = [[18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["T"] = [[19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["U"] = [[20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["V"] = [[21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["W"] = [[22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["X"] = [[23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["Y"] = [[24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["Z"] = [[25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["2"] = [[26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["3"] = [[27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["4"] = [[28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["5"] = [[29], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["6"] = [[30], [20], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["7"] = [[31], [30], [29], [28], [27], [26], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];

    let result = permutationsDPHelper(arrayDigits, memo);

    return result;
}

/**
 * 
 * 
 * @param {array} arrayDigits MUST BE SORTED IN INCREASING TO DECREASING
 * e.g. [3,1], expecting [[3,1], [2,1], [1,1]]
 */
const permutationsDPHelper = (arrayDigits, memo) => {
    let key = "";

    // convert to key, typeof string (memo's keys are strings of digits in Base32)
    for (let digitIndex = 0; digitIndex < arrayDigits.length; digitIndex++)
        key += tenToThirtyTwo[arrayDigits[digitIndex]];
    
    // memoisation exists
    if (memo[key] != undefined) {
        return memo[key]
    }
    // memo doesn't exist, recurse
    else {
        let lastIndex = arrayDigits.length - 1;

        // get all integers that are [0, lastDigit] 
        let lastDigit = arrayDigits[lastIndex];
        let allDigitsToConcat = [];
        for (let i = 0; i <= lastDigit; i++)
            allDigitsToConcat.push(i)

        // get reduced array excluding last digit
        let reducedArray = [];
        for (let i = 0; i < arrayDigits.length - 1; i++)
            reducedArray.push(arrayDigits[i])

        // get memoisation on reducedArray
        let memoisedArray = permutationsDPHelper(reducedArray, memo);
        // console.log("memoised array: ", memoisedArray);

        let resultArray = [];

        // iterate through permutations
        for (let permInd in memoisedArray) { // O(k^(n-1))
            let aPermutation = memoisedArray[permInd];

            let concatPermutation = [];

            // iterate through digits of memoised array and populate concatPermutation
            for (let digitInd in aPermutation)
                concatPermutation.push(aPermutation[digitInd]);
            // console.log("concatPermutation here: ", concatPermutation);

            // add new digits to permutation
            for (let digitInd in allDigitsToConcat) {
                let copiedConcatPermutation = [...concatPermutation];
                copiedConcatPermutation.push(allDigitsToConcat[digitInd]);
                resultArray.push(copiedConcatPermutation);
            }

            // console.log("concatPermutation end: ", concatPermutation);
        }

        memo[key] = resultArray; // memoise
        return resultArray;
    }

}

const permutationsRec = (arrayDigits) => {

    let permutationNull = [];
    for (i in arrayDigits)
        permutationNull.push(null);

    let permutationRecords = [];
    permutationsRecHelper(0, permutationNull, arrayDigits, permutationRecords);

    return permutationRecords;
}

const permutationsRecHelper = async (currIndex, recursedPermutation, arrayDigits, permutationRecords) => {

    // console.log(recursedPermutation, " : ", currIndex);
    if (currIndex < recursedPermutation.length) {

        let possibleDigitsForCurrIndex = [];

        for (let i = 1; i <= arrayDigits[currIndex]; i++)
            possibleDigitsForCurrIndex.push(i);

        let count = 0;

        // Substitute a digit in currIndex
        while (count < possibleDigitsForCurrIndex.length) {
            let digit = possibleDigitsForCurrIndex[count];

            count++;

            // console.log(masterStructure);

            let updatedrecursedPermutation = [...recursedPermutation]; // copy construct
            updatedrecursedPermutation[currIndex] = digit;
            if (count == possibleDigitsForCurrIndex.length)
                recursedPermutation = null;
            permutationsRecHelper(currIndex + 1, updatedrecursedPermutation, arrayDigits, permutationRecords);
        }

        count = null;

    }
    // Base case
    else {
        permutationRecords.push(recursedPermutation);
        return;
    }
}

/**
 * @param {array} arrayDigits Doesn't have to be sorted
 * @returns 
 */
const getRandomPermutation = (arrayDigits) => {
    let randomPermutation = [];
    for (let index in arrayDigits) {
        let digit = Math.floor(Math.random() * (arrayDigits[index]+1));
        randomPermutation.push(digit);
        digit = null;
    }
    return randomPermutation
}


/** Gets random 50 permutations 
 * ASSUMES THERE ARE AT LEAST 50 POSSIBLE PERMUTATIONS 
 * 
 * @param {array} arrayDigits 
 */
const permutationsRandom = (arrayDigits, maxSize) => {

    let permutationRecords = {};
    let size = 0;
    while (size < maxSize) {
        let permutation = getRandomPermutation(arrayDigits);

        let key = "";

        for (index in permutation)
            key += permutation[index].toString();

        if (permutationRecords[key] == undefined) {
            permutationRecords[key] = permutation
            size++;
        }

    }
    let resultArray = [];
    for (let recordKey in permutationRecords)
        resultArray.push(permutationRecords[recordKey])

    return resultArray;
}

const getPermutations = (arrayDigits, callback) => {
    
    let chosenPermutations;  // to return
    
    /* check constraints */

    // get largest digit
    let largestDigit = 0;
    let totalDigits = 0;
    let lengthOfPermutation = arrayDigits.length;

    for (let i in arrayDigits) {
        let choices = arrayDigits[i];
        
        if (choices.length > largestDigit) 
            largestDigit = choices.length;

        for (let j in choices) {
            totalDigits++;
        }
    }

    if (largestDigit > LARGEST_POSSIBLE_DIGIT_DP + 1) {
        if (totalDigits > 48) {
            console.log("Using randomized algorithm here");
            chosenPermutations = permutationsRandom(arrayDigits, 100);
        }
        else {
            // console.log("Using recursive algorithm here");
            // chosenPermutations = permutationsRec(arrayDigits);
            console.log("(api/courses/schedule):", "Using randomized algorithm there");
            chosenPermutations = permutationsRandom(arrayDigits, 100);
        }
    }
    else {
        if (lengthOfPermutation > 15) {
            // console.log("Using DP algorithm there");
            // chosenPermutations = permutationsDP(arrayDigits);
            console.log("(api/courses/schedule):", "Using randomized algorithm there");
            chosenPermutations = permutationsRandom(arrayDigits, 100);
        }
        else  {
            console.log("(api/courses/schedule):", "Using randomized algorithm there");
            chosenPermutations = permutationsRandom(arrayDigits, 100);
            // console.log("Using DP algorithm there");
            // chosenPermutations = permutationsDP(arrayDigits);
        }
    }

    return chosenPermutations;
}

exports.permutationsDP = permutationsDP;
exports.permutationsRandom = permutationsRandom;
exports.permutationsRec = permutationsRec;
exports.getPermutations = getPermutations;
exports.LARGEST_POSSIBLE_DIGIT_DP = LARGEST_POSSIBLE_DIGIT_DP;