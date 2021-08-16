let degreePlanHandler = require('../degreePlan');

const testTermIntegerToDesc = function() {
    // "FALL": "8",
    // "spring": "2",
    // "summer": "5",
    // "annual": "4"
    try {
        let testTermInts = [2218,2242,2225,2224];
        let expectedTermDescs = ["2021 Fall", "2024 Spring", "2022 Summer", "2022-2023 Annual"];
        for (let i = 0; i < testTermInts.length; i++) {
            let term = degreePlanHandler.termIntegerToDesc(testTermInts[i]);
            if (term !== expectedTermDescs[i])
                throw term + " is not equal to " + expectedTermDescs[i];
        }

        console.error("testing termIntegerToDesc SUCCESS");
    }
    catch(e) {
        console.error("testing termIntegerToDesc FAILED: ", e);
    }
}

const testDescToTermInteger = function () {
    // "FALL": "8",
    // "spring": "2",
    // "summer": "5",
    // "annual": "4"
    try {
        let testTermDescs = ["2021 Fall", "2024 Spring", "2022 Summer", "2022-2023 Annual"];
        let expectedTermInts = [2218,2242,2225,2224];
        for (let i = 0; i < testTermDescs.length; i++) {
            let term = degreePlanHandler.descToTermInteger(testTermDescs[i]);
            if (term !== expectedTermInts[i])
                throw term + " is not equal to " + expectedTermInts[i];
        }

        console.error("testing termIntegerToDesc SUCCESS");
    }
    catch(e) {
        console.error("testing termIntegerToDesc FAILED: ", e);
    }
}

const runTests = function () {
    testDescToTermInteger();
    testTermIntegerToDesc();
}

runTests();