const getPossibleDigits = (global) => {
    return new Promise ((resolve, reject)=>  {

        let arrayCourses = global.arrayCourses;

        /* Error catching */
        if (arrayCourses.length == 0)
            reject(new Error("getPossibleDigits: length of arrayCourses is 0"));
        else if (arrayCourses === undefined)
            reject(new Error("getPossibleDigits: arrayCourses is undefined"));

        let start = Date.now();

        let possibleDigits = [];
        // iterate through courses
        for (let index in arrayCourses) {
            let course = arrayCourses[index];
            let sections = course.getSections();

            // iterate through section types
            for (let sectiontype in sections) {
                let sectionsInSecType = sections[sectiontype];

                // append maximum digits
                possibleDigits.push(Object.keys(sectionsInSecType).length - 1);
            }

        }

        let end = Date.now();
        let difference = end - start;
        let timeTakenString = difference.toString() + "ms";
        console.log("(api/courses/schedule):", "Get Possible Digits took: ", timeTakenString);
        
        /* add variables to global */
        global.possibleDigits = possibleDigits;
    
        resolve(global);
    });
    
}

module.exports = getPossibleDigits;