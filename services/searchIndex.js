exports.generateSearchIndex = async (courseIds, courseNames, collection) => { 
    try {

        let index = {};

        /* Map course ids substrings to course documents */
        for (let i = 0; i < courseIds.length; i++) {
            let courseId = courseIds[i];
            let courseIdLowerCase = courseId.toLowerCase(); // all keys must be lowercase

            if (index[courseIdLowerCase] == undefined) {
                
                index[courseIdLowerCase] = [];

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

                    /* map course id substrings */
                    for (let j = 1; j < courseIdLowerCase.length; j++) {
                        let substr = courseIdLowerCase.substring(0, j);

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