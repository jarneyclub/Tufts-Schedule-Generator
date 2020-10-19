
/** Section class
 * 
 * @param {string} courseID 
 * @param {string} sectionName 
 * @param {list} times 
 * @param {string} location 
 * @param {string} city 
 * @param {list} instructors 
 * @returns {Section}
 */
function Section ( courseID, sectionName, times, location, city, instructors, sectionType ) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    const courseID = courseID;
    const sectionName = sectionName;
    const sectionType = sectionType;

    const daysOfWeek = times[0];
    // NOTE: time = 0 is 12AM
    const timeBegin = times[1][0];
    const timeEnd = times[1][0];

    const location = location;
    const city = city;
    const instructors = instructors;

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