exports.generateSearchIndex = async (courseIds, courseNames, collection) => { 
    try {

        let index = {};

        /* Map course ids substrings to course documents */
        for (let i = 0; i < courseIds.length; i++) {
            let courseId = courseIds[i];
            let courseIdLowerCase = courseId.toLowerCase(); // all keys must be lowercase

            let splitCourseIdArr = courseIdLowerCase.split('-'); // split at dash
            let idLetters = splitCourseIdArr[0]; // get only the letters of course id
            let idNumber = splitCourseIdArr[1]; // get only the number of course id            
            // remove leading zeroes after dash in courseId
            while (idNumber[0] === '0') {
                idNumber = idNumber.substring(1, idNumber.length);
            }
            let courseIdLowerCaseWoLeadingZeroes = splitCourseIdArr[0] + '-' + idNumber;
            let courseIdLowerCaseWoLzeroesAndDash = splitCourseIdArr[0] + idNumber;

            if (index[courseIdLowerCase] == undefined) {
                /* there is yet not a key in the index that matches the exact course id */

                index[courseIdLowerCase] = []; // initialize key and values

                let cursor = await collection.find({ course_id: courseId });

                // go through each document and append
                await cursor.forEach((doc) => {

                    // remove some fields from original document to decrease document size
                    let parsedDocument = {
                        _id: doc._id.toString(),
                        course_name: doc.course_name,
                        course_id: doc.course_id

                    }
                    index[courseIdLowerCase].push(parsedDocument);

                    // map exact course id substrings
                    for (let j = 1; j < courseIdLowerCase.length; j++) {
                        let substr = courseIdLowerCase.substring(0, j);

                        if (index[substr] == undefined) {
                            index[substr] = [];
                        }

                        index[substr].push(parsedDocument);
                    }
                    
                    let lengthCourseIdLetters = idLetters.length
                    let lengthCourseIdNumberWoLzeroes = idNumber.length;
                    // console.log("idLetters: ", idLetters)
                    // console.log("idNumber: ", idNumber)
                    // console.log("lengthCourseIdLetters: ", lengthCourseIdLetters)
                    // console.log("lengthcIdwithoutleading: ", lengthCourseIdNumberWoLzeroes)
                    // length of already existing key with letters + dash
                    let lengthExistingKey = lengthCourseIdLetters + 1
                    // console.log("lengthExistingKey: ", lengthExistingKey)
                    // map course id without leading zeroes substrings
                    for (let j = 0; j < idNumber.length; j++) {
                        let firstInd = lengthExistingKey;
                        let lastInd = lengthExistingKey + j;
                        let toAppend = courseIdLowerCaseWoLeadingZeroes.substring(firstInd, lastInd);
                        // console.log("toappend: ", toAppend)
                        let substr = idLetters + "-" + toAppend;
                        // console.log("substr: ", substr)
                        if (index[substr] == undefined) {
                            index[substr] = [];
                        }

                        index[substr].push(parsedDocument);
                    }


                });
            }

        }

        /* Map complete course names to course documents */
        // for (let i = 0; i < courseNames.length; i++) {
        //     let courseName = courseNames[i];
        //     let courseNameLowerCase = courseName.toLowerCase();

        //     let cursor = await collection.find({ course_name: courseName });

        //     /* go through each document and append to response */
        //     await cursor.forEach((doc) => {
        //         // remove some fields from original document to decrease document size
        //         let parsedDocument = {
        //             _id: doc._id.toString(),
        //             course_name: doc.course_name,
        //             course_id: doc.course_id

        //         }
        //         if (index[courseNameLowerCase] == undefined)
        //             index[courseNameLowerCase] = [];
        //         else {

        //         }
        //         index[courseNameLowerCase].push(parsedDocument);

        //         /* split courseNames by spaces and map all substrings to documents*/
        //         let splitCourseName = courseNameLowerCase.split(/[ ]/);
        //         for (let j = 0; j < splitCourseName.length; j++) {
        //             let word = splitCourseName[j];

        //             /* iterate through substrings from index 0*/
        //             for (let k = 1; k <= word.length; k++) {
        //                 let substr = word.substring(0, k);

        //                 if (index[substr] == undefined) {
        //                     index[substr] = [];
        //                 }
        //                 else {
        //                     /* check if this document is already in the index */
        //                     for (let t = 0; t < index[substr].length; t++) {
        //                         let singleDoc = index[substr][t];
        //                         singleDoc
        //                     }
        //                 }

        //                 index[substr].push(parsedDocument);

        //             }
        //         }
        //     });

        // }
        // console.log(index);
        return index;
    }
    catch(e) {
        console.log("Error: ", e);
    }

}