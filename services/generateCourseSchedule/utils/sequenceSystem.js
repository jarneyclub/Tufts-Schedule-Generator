/*
 * Name: Natural Number Sequence System
 * Description: Creates a number system of a computable sequence
 * Assumptions for complexity calculation:
 * n <- number of elements in the sequence
 * k <- maximum digit of any element
*/

function sequenceSys () {
    var curr = [];
    var maxList = [];
    
    /** Space: O(n)
     * Time: O(n)
     * @param {array} max 
     */
    const init = (max) => {
        
        // Credit to Juni Brosas from Stack Overflow
        // maxList = ("" + max).split('').map(Number);
        maxList = max
        for (let i = 0; i < maxList.length; i++)
            curr.push(0);
    }


    /** Time: O(n)
     * Space: O(n*k)
     * 
     * @returns {array}
     */
    const getCurr = () => {

        return curr;
    }

    /** Space: O(2n)
     * Time: O(n)
     * @param {array} arr1 
     * @param {array} arr2 
     * @returns 
     */
    const arraysAreEqual = (arr1, arr2) => {

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    /** Time: O(n)
     * Space: O(1)
     * 
     * @param {any} i 
     * @param {any} val 
     * @param {any} maxVal 
     */
    const incrementDigits = (i, val, maxVal) => {
        if (val < maxVal) {
            let newVal = val + 1;
            curr[i] = newVal;
        }
        else if (val == maxVal) {
            let newVal = 0;
            curr[i] = newVal;

            if (i > 0)
                incrementDigits(i - 1, curr[i - 1], maxList[i - 1]);
        }
    }

    /** Time: O(n)
     * Space: O(1)
     */
    const increment = () => {
        
        if (arraysAreEqual(curr, maxList)) {
            throw Error("incrementation has reached maximum digit")
        }

        let lastInd = curr.length - 1;

        incrementDigits(lastInd, curr[lastInd], maxList[lastInd]);
    }

    return {
        init: init,
        getCurr: getCurr,
        increment: increment
    }
}

exports.sequenceSys = sequenceSys;