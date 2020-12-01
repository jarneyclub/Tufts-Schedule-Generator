
/** Section class
 * 
 * @param {any} inputCourseID 
 * @param {any} inputSectionName 
 * @param {any} inputSectionType 
 * @param {any} inputTimes {0: [days of week], 1: [begin, end]}
 * @param {any} inputLocation 
 * @param {any} inputCity 
 * @param {any} inputInstructors 
 * @returns 
 */
function Section ( inputCourseID, inputSectionName, inputSectionType, inputTimes, inputLocation, inputCity, inputInstructors) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    const courseID = inputCourseID;
    const sectionName = inputSectionName;
    const sectionType = inputSectionType;
    
    const daysOfWeek = inputTimes[0];
    // NOTE: time = 0 is 12AM
    const timeBegin = inputTimes[1][0];
    const timeEnd = inputTimes[1][1];

    const location = inputLocation;
    const city = inputCity;
    const instructors = inputInstructors;

    /* array of available times, array of [day, start, end] elements */
    var timesArray = function () {
        var result = [];
        for ( var index in daysOfWeek ) {
            var singleClass = [];
            singleClass.push(daysOfWeek[index]); // append a day of week
            singleClass.push(timeBegin);
            singleClass.push(timeEnd);
            result.push(singleClass);
        }
        return result;
    }

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /** Get duration of section
     * @returns {integer} 1 = a minute
     */
    function getDuration() {
        return timeEnd- timeBegin;
    }

    /** Get array of times
     * @returns  array of available times, array of [day, start, end] elements
     */
    function getTimes() {
        return timesArray;
    }

    /** Get start time of section
     * @returns {integer} [0 to 1440], 0 being 12AM, 1440 being 12AM 24 hrs later
     */
    function getStartTime() {
        return timeBegin;
    }

    /** Get end time of section
     * @returns {integer} [0 to 1440], 0 being 12AM, 1440 being 12AM 24 hrs later
     */
    function getEndTime() {
        return timeEnd;
    }

    /** Get days of the week the section is on
     * @returns {list} 1-indexed days of the week (e.g. monday = 1 )
     */
    function getDays() {
        return daysOfWeek;
    }
    
    /** Get instructors of the section
     * @returns {list} names of instructors
     */
    function getInstructors() {
        return instructors;
    }

    /** Get courseID of section
     * @returns {string} course ID (e.g. COMP-0015)
     */
    function getCourseID() {
        return courseID
    }

    /** Get name of section
     * @returns {string} section name (e.g. LEC-1)
     */
    function getSectionName() {
        return sectionName
    }

    /** Get type of section
     * @returns {string}
     */
    function getSectionType() {
        return sectionType;
    }

    /** Get location of section
     * @returns {string} 
     */
    function getLocation() {
        return location;
    }

    /** Get city of section
     * @returns {string}
     */
    function getCity() {
        return city;
    }

    return {
        getDuration,
        getTimes,
        getStartTime,
        getEndTime,
        getDays,
        getInstructors,
        getCourseID,
        getSectionName,
        getLocation,
        getCity,
        getSectionType
    }
}

module.exports = Section;