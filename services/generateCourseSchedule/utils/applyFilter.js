/** INCLUSIVELY checks if [beginInside, endInside] is within [beginOutside, endOutside];
 * Assumption: begin < end
 * @param {any} beginOutside 
 * @param {any} endOutside 
 * @param {any} beginInside 
 * @param {any} endInside 
 */
const withinBounds = (beginOutside, endOutside, beginInside, endInside) => {
    if (beginOutside <= beginInside && endInside <= endOutside)
        return true;
    else
        return false;
}

/** Create global.arrSecTypes, a data structure
 *  that will be used throughout the workflow
 *  for schedule generation
 * TODO: debug sections leaking through although time preference was not satisfied
 * @param {object} global 
 * @returns {Promise}
 */
const createArrSectionTypes = (global) => {
    return new Promise((resolve, reject) => {

        let start = Date.now(); // start timer

        let arrayCourses = global.arrayCourses;
        let filter = global.filterPreprocessed;
        let timePref = filter.time;
        // console.log("(applyFilter/createArrSectionTypes) filter.misc: ", filter.misc);
        // default miscellaneous filters
        let ignoreTU = false;
        let ignoreM = false;
        let ignoreClosed = false;
        let ignoreWL = true;
        // apply user filters if provided (reverse the booleans)
        if (filter.misc !== undefined) {
            ignoreTU = filter.misc.ignoreTU;
            ignoreM = filter.misc.ignoreM;
            ignoreClosed = filter.misc.ignoreClosed;
            ignoreWL = filter.misc.ignoreWL;
        }
        console.log("(applyFilter/createArrSectionTypes) filter.misc: ", filter.misc);


        // record of filtered section information (for verbose error messages)
        let filtrationRecord = {
            numOfSecsInSecType: undefined,
            numOfSecsIgnored: undefined,
            numOfSecsIgnoredByignoreTU: undefined,
            numOfSecsIgnoredByignoreM: undefined,
            numOfSecsIgnoredByignoreClosed: undefined,
            numOfSecsIgnoredByignoreWL: undefined,
            numOfSecsIgnoredByTime: undefined,
        }

        let mapSectionTypes = [];
        for (i in arrayCourses) {
            let course = arrayCourses[i];
            /* [   { '0': Section }, // one section type
             { '0': Section,
              '1': Section } // second section type ]         */
            let sectionsInSecTypes = course.getSections();

            for (let j in sectionsInSecTypes) {
                let sections = sectionsInSecTypes[j];
                console.log("createArrSectionTypes) sections:", sections);
                let secsToInsert = [];
                filtrationRecord.numOfSecsInSecType = Object.keys(sections).length;
                filtrationRecord.numOfSecsIgnored = 0;
                filtrationRecord.numOfSecsIgnoredByignoreTU = 0;
                filtrationRecord.numOfSecsIgnoredByignoreM = 0;
                filtrationRecord.numOfSecsIgnoredByignoreClosed = 0;
                filtrationRecord.numOfSecsIgnoredByignoreWL = 0;
                filtrationRecord.numOfSecsIgnoredByTime = 0;

                // iterate through Sections
                for (let k in sections) {
                    let sec = sections[k];
                    let classes = sec.getClasses();
                    
                    let withinUserPreference = false;

                    // iterate through Classes
                    for (let l in classes) {

                        // reinit withinUserPref flag 
                        // (if at any point in this loop this flag is true, loop will break)
                        withinUserPreference = true; 

                        let aClass = classes[l];

                        // flags about the Section
                        let timeIsUnspecified = false;
                        let isMSection = false;

                        let classStartTime = aClass.getStartTime();
                        let classEndTime = aClass.getEndTime();
                        let secName = aClass.getSectionName();
                        
                        // Check if class time is unspecified
                        if (classStartTime == -1 || classEndTime == -1)
                            timeIsUnspecified = true;

                        if ( timeIsUnspecified === false ) {
                            /* Class time is specified */

                            // Check if class time within user preferences of a day
                            let dayOfWeek = aClass.getDayOfWeek();

                            let timePreferencesOnDay = timePref[dayOfWeek];
                            for (let i = 0; i < timePreferencesOnDay.length; i++) {
                                let timeStartFilter = timePreferencesOnDay[i].time_earliest;
                                let timeEndFilter = timePreferencesOnDay[i].time_latest;

                                if (withinBounds(timeStartFilter, timeEndFilter, classStartTime, classEndTime) == true) {
                                    /* Class is within user time preference */
                                    break;
                                }
                            } /* (End of) loop over a single day's time preferences */
                        }
                        else {
                            /* Class time is unspecified */

                            if (ignoreTU !== undefined && ignoreTU === true) {
                                /* Cannot insert this Section (TU filter) */

                                console.log("(applyFilter) Time was not specified. Ignoring...");
                                withinUserPreference = false;
                                
                                // update records
                                filtrationRecord.numOfSecsIgnored++; 
                                filtrationRecord.numOfSecsIgnoredByignoreTU++;
                                break;
                            }
                        }

                        if (withinUserPreference === false) {
                            /* Time was specified, but current Class did not match user time preferences */
                            // console.log("(applyFilter) Time is not within bounds. ")
                            // update records
                            filtrationRecord.numOfSecsIgnored++;
                            filtrationRecord.numOfSecsIgnoredByTime++;
                            break;
                        }
                        else  {
                            // console.log("(applyFilter) Time IS within bounds. ")
                        }

                        // apply ignore MSection filter
                        if (secName.indexOf("M") == 0) {
                            /* Section of this Class is an "M" section*/
                            console.log("(applyFilter) M secName: ", secName);
                            isMSection = true;
                        }
                        
                        if (ignoreM !== undefined && ignoreM === true) {

                            if (isMSection === true) {
                                /* Cannot insert this Section (Msection filter) */

                                console.log("(applyFilter) M section. Ignoring...")

                                // update records
                                filtrationRecord.numOfSecsIgnored++;
                                filtrationRecord.numOfSecsIgnoredByignoreM++;

                                withinUserPreference = false;
                                break;
                            }
                        }

                        if (!withinUserPreference)
                            console.log("(applyFilter) impossible withinUserPreference === false")

                    } /* (End of) loop over Classes */

                    // apply ignoreClosed and ignoreWL filters
                    let secStatus = sec.getSectionStatus();
                    
                    if (ignoreClosed === true)
                        if (secStatus === "closed") {
                            
                            withinUserPreference = false;
                            console.log("(applyFilter) closed section...ignoring")
                            // update records
                            filtrationRecord.numOfSecsIgnored++;
                            filtrationRecord.numOfSecsIgnoredByignoreClosed++;
                        }
                    
                    if (ignoreWL === true)
                        if (secStatus === "waitlist") {
                            withinUserPreference = false;
                            console.log("(applyFilter) waitlist section...ignoring..")
                            // update records
                            filtrationRecord.numOfSecsIgnored++;
                            filtrationRecord.numOfSecsIgnoredByignoreWL++;
                        }
                    
                    // insert if all filters applied without issue
                    if ( withinUserPreference === true ) {
                        secsToInsert.push(sec);
                    }

                } /* (End of) loop over Sections */

                let sectionTypeObj = {};
                let indexSection = 0;
                console.log("(createArrSectionTypes) secsToInsert: ", secsToInsert);
                for ( let i in secsToInsert ) {
                    
                    let sec = secsToInsert[i]; // Section object
                    sectionTypeObj[indexSection.toString()] = sec;
                    indexSection++;
                }
                
                if (sectionTypeObj["0"] === undefined) {
                    console.log("(applyFilter) sectionTypeObj: ", sectionTypeObj)
                    reject("No schedule matches your courses and user preferences. Please reselect your preferences.")
                }
                mapSectionTypes.push(sectionTypeObj);

            } /* (End of) loop over section types */
        }

        /*
        [
         { '0': Section }, // one section type
         { '0': Section, 
          '1': Section } // second section type
        ]
        */
        global.arrSecTypes = mapSectionTypes;
        // console.log("arrSectionTypes: ", mapSectionTypes);

        let end = Date.now();
        let difference = end - start;
        let timeTakenString = difference.toString() + "ms";
        console.log("(api/courses/schedule):", "applyFilter.js/createrArrSectionType() took: ", timeTakenString);

        resolve(global);
    });
}


exports.createArrSectionTypes = createArrSectionTypes;