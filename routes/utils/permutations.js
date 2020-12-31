const LARGEST_POSSIBLE_DIGIT_DP = 15;

/** Generates all possible permutations of a given array of digits
 * IMPORTANT: ONLY SUPPORTS DIGITS [0-9]
 * O(n*k^n) NOT TIGHT
 * @param {array} arrayDigits array of digits that is 0 to 9
 * e.g. [3,1], expecting [[3,1], [2,1], [1,1]]
 * @returns 
 */
const permutationsDP = (arrayDigits) => {
    
    // identify base cases
    var memo = {};

    memo["0"] = [[0]]
    memo["1"] = [[1], [0]];
    memo["2"] = [[2], [1], [0]];
    memo["3"] = [[3], [2], [1], [0]];
    memo["4"] = [[4], [3], [2], [1], [0]];
    memo["5"] = [[5], [4], [3], [2], [1], [0]];
    memo["6"] = [[6], [5], [4], [3], [2], [1], [0]];
    memo["7"] = [[7], [6], [5], [4], [3], [2], [1], [0]];
    memo["8"] = [[8], [7], [6], [5], [4], [3], [2], [1], [0]];
    memo["9"] = [[9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["10"] = [[10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["11"] = [[11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["12"] = [[12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["13"] = [[13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["14"] = [[14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];
    // memo["15"] = [[15], [14], [13], [12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1], [0]];



    return permutationsDPHelper(arrayDigits, memo);
}

/**
 * 
 * 
 * @param {array} arrayDigits MUST BE SORTED IN INCREASING TO DECREASING
 * e.g. [3,1], expecting [[3,1], [2,1], [1,1]]
 */
const permutationsDPHelper = (arrayDigits, memo) => {

    let key = "";

    // convert to key, typeof string (memo's keys are strings of digits)
    for (let digitIndex = 0; digitIndex < arrayDigits.length; digitIndex++)
        key += arrayDigits[digitIndex].toString();

    // memoisation exists
    if (memo[key] != undefined) {
        return memo[key]
    }
    // memo doesn't exist, recurse
    else {
        let lastIndex = arrayDigits.length - 1;

        // get all integers from 0 to lastDigit 
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
            chosenPermutations = permutationsRandom(arrayDigits, 100);
        }
        else {
            chosenPermutations = permutationsDP(arrayDigits);
        }
    }
    else {
        if (lengthOfPermutation > 15)
            chosenPermutations = permutationsDP(arrayDigits);
        else 
            chosenPermutations = permutationsRandom(arrayDigits, 100);
    }

    return chosenPermutations;
}

exports.permutationsDP = permutationsDP;
exports.permutationsRandom = permutationsRandom;
exports.permutationsRec = permutationsRec;
exports.getPermutations = getPermutations;
exports.LARGEST_POSSIBLE_DIGIT_DP = LARGEST_POSSIBLE_DIGIT_DP;