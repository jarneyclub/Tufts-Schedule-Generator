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
 * @param {object} global 
 * @returns {Promise}
 */
const createArrSectionTypes = (global) => {
    return new Promise((resolve, reject) => {

        let arrayCourses = global.arrayCourses;
        let filter = global.filter;
        // default miscellaneous filters
        let ignoreTU = false;
        let ignoreM = false;
        let ignoreClosed = true;
        let ignoreWL = true;
        // apply user filters if provided
        if (filter.misc !== undefined) {
            ignoreTU = filter.misc.ignoreTU;
            ignoreM = filter.misc.ignoreM;
            ignoreClosed = filter.misc.ignoreClosed;
            ignoreWL = filter.misc.ignoreWL;
        }
        let timePref = filter.time;

        let mapSectionTypes = [];
        for (i in arrayCourses) {
            let course = arrayCourses[i];
            /* [   { '0': Section }, // one section type
             { '0': Section,
              '1': Section } // second section type ]         */
            let sectionsInSecTypes = course.getSections();

            for (let j in sectionsInSecTypes) {
                let sections = sectionsInSecTypes[j];

                let secsToInsert = [];
                let secsInCourse = Object.keys(sections).length; // use later to notify users when a course with a single section had its section ignored
                for (let k in sections) {
                    let sec = sections[k];
                    let classes = sec.getClasses();
                    
                    let withinUserPreference = false;

                    for (let l in classes) {
                        let aClass = classes[l];

                        // passing flags
                        let timeWithinBounds = false; // flag for user time preference
                        let timeIsUnspecified = false;
                        let isMSection = false;
                        let classStartTime = aClass.getStartTime();
                        let classEndTime = aClass.getEndTime();
                        let secName = aClass.getSectionName();
                        
                        // Check if class time is unspecified
                        if (classStartTime == -1 || classEndTime == -1)
                            timeIsUnspecified = true;

                        if ( timeIsUnspecified === false ) {

                            // Check if class time within user preference
                            let dayOfWeek = aClass.getDayOfWeek();

                            let timePreferencesOnDay = timePref[dayOfWeek];

                            for (let i = 0; i < timePreferencesOnDay.length; i++) {
                                let timeStartFilter = timePreferencesOnDay[i].time_earliest;
                                let timeEndFilter = timePreferencesOnDay[i].time_latest;

                                if (withinBounds(timeStartFilter, timeEndFilter, classStartTime, classEndTime) == true) {
                                    timeWithinBounds = true;
                                    break;
                                }
                            }
                        }
                        else {
                            /* time is unspecified */

                            // Apply Ignore Time Unspecified filter
                            if (ignoreTU !== undefined && ignoreTU === true) {
                                withinUserPreference = false;

                                break;
                            }
                        }

                        withinUserPreference = timeWithinBounds;

                        // Apply ignore MSection filter
                        if (secName.indexOf("M") == 0) {
                            console.log("M secName: ", secName);
                            isMSection = true;
                        }
                        
                        if (ignoreM !== undefined && ignoreM === true)
                            if (isMSection === true) {
                                withinUserPreference = false;
                                break;
                            }
                    }

                    if ( withinUserPreference === true ) {
                        secsToInsert.push(sec);
                    }

                }

                let sectionTypeObj = {};
                let indexSection = 0;
                for ( let i in secsToInsert ) {
                    
                    let sec = secsToInsert[i]; // Section object

                    sectionTypeObj[indexSection.toString()] = sec;
                    indexSection++;
                }
                mapSectionTypes.push(sectionTypeObj);
            }
        }

        /*
        [
         { '0': Section }, // one section type
         { '0': Section, 
          '1': Section } // second section type
        ]
        */
        global.arrSecTypes = mapSectionTypes;
        console.log("arrSectionTypes: ", mapSectionTypes);
        resolve(global);
    });
}


exports.createArrSectionTypes = createArrSectionTypes;