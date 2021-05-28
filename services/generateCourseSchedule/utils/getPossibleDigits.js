const getPossibleDigits = (global) => {
    return new Promise ((resolve, reject)=>  {

        let arrSectionTypes = global.arrSecTypes;

        let start = Date.now();

        let possibleDigits = [];

        // iterate through courses
        for (let index in arrSectionTypes) {

            /* { '0': Section,
                    '1': Section }  */
            let sectionsObj = arrSectionTypes[index];

            possibleDigits.push(Object.keys(sectionsObj).length - 1);
        }

        let end = Date.now();
        let difference = end - start;
        let timeTakenString = difference.toString() + "ms";
        // console.log("(api/courses/schedule):", "Get Possible Digits took: ", timeTakenString); //!!!!!
        
        /* add variables to global */
        global.possibleDigits = possibleDigits;
        // console.log("possibleDigits: ", possibleDigits); //!!!!!
        resolve(global);
    });
    
}

module.exports = getPossibleDigits;