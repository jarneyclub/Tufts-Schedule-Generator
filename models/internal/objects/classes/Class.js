
/** Class class
 * Definition: 
 * - a Class is a single weekly class period of a Section 
 *   that occurs on the same day, same time, every week.
* @param {any} inputCourseID
* @param {any} inputCourseName
 * @param {any} inputSectionName
 * @param {any} inputSectionType
 * @param {integer} inputDay e.g. Monday = 1
 * @param {integer} inputStartTime
 * @param {integer} inputEndTime 
 * @param {any} inputTimes {0: day of week, 1: [begin, end]}
 * @param {any} inputLocation
 * @param {any} inputCity
 * @param {any} inputInstructors
 * @returns 
 */
function Class(inputCourseID, inputCourseName, inputSectionName, inputSectionType, inputDay, inputStartTime, inputEndTime, inputLocation, inputCity, inputInstructors, inputSectionId, inputCourseDatabaseId) {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    const courseID = inputCourseID;
    const courseName = inputCourseName;
    const sectionName = inputSectionName;
    const sectionType = inputSectionType;
    const sectionId = inputSectionId;
    const courseDatabaseId = inputCourseDatabaseId;

    const dayOfWeek = inputDay

    // NOTE: time = 0 is 12AM
    const timeBegin = inputStartTime;
    const timeEnd = inputEndTime;

    const location = inputLocation;
    const city = inputCity;
    const instructors = inputInstructors;

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /** Get duration of section
     * @returns {integer} 1 = a minute
     */
    function getDuration() {
        return timeEnd - timeBegin;
    }

    /** Get day of the week
     * @returns {integer} day of the week (e.g. monday = 1 )
     */
    function getDayOfWeek() {
        return dayOfWeek;
    }
    
    
    /** Get day of the week as String version
     * @returns {string} day of the week (e.g. 1 = "Monday")
     */
     function getDayOfWeekString() {
        if (dayOfWeek == -1 || dayOfWeek > 5) {
            return "TimeUnspecified";
        }
     
        let daysArray = ["TimeUnspecified", "Monday", "Tuesday", 
                            "Wednesday", "Thursday", "Friday"];
        return daysArray[dayOfWeek];
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

    /** Get courseID of section
     * @returns {string} course ID (e.g. COMP-0015)
     */
    function getSectionID() {
        return sectionId;
    }
    

    /** Get courseName of section
    * @returns {string} course name
    */
    function getCourseName() {
        return courseName
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

    /** Get course database id of class
    * @returns {string}
    */
    function getCourseDatabaseId () {
        return courseDatabaseId;
    }

    return {
        getDuration,
        getDayOfWeek,
        getDayOfWeekString,
        getStartTime,
        getEndTime,
        getInstructors,
        getCourseID,
        getCourseName,
        getSectionName,
        getLocation,
        getCity,
        getSectionType,
        getSectionID,
        getCourseDatabaseId
    }
}

module.exports = Class;