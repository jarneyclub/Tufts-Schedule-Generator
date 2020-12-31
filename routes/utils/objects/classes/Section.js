
/** Section class
 * 
 * @param {any} inputCourseID 
 * @param {any} inputCourseName 
 * @param {any} inputSectionName 
 * @param {any} inputSectionType 
 * @param {any} inputClasses
 * @returns 
 */
function Section ( inputCourseID, inputCourseName, inputSectionName, inputSectionType, inputClasses) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    const courseID = inputCourseID;
    const courseName = inputCourseName;
    const sectionName = inputSectionName;
    const sectionType = inputSectionType;

    const classes = inputClasses;

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /** Get courseID of section
     * @returns {string} course ID (e.g. COMP-0015)
     */
    function getCourseID() {
        return courseID;
    }

    /** Get courseName of section
    * @returns {string} course name
    */
    function getCourseName() {
        return courseName;
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

    function getClasses () {
        return classes;
    }

    return {
        getCourseID,
        getSectionName,
        getSectionType,
        getCourseName,
        getClasses
    }
}

module.exports = Section;