
/** Section class
 * 
 * @param {string} inputCourseID 
 * @param {string} inputCourseName 
 * @param {string} inputSectionName 
 * @param {string} inputSectionType 
 * @param {object} inputClasses {'0': Class, '1': Class}
 * @param {string} inputSectionStatus 'closed', 'waitlist', 'open'
 * @returns 
 */
function Section ( inputCourseID, inputCourseName, inputSectionName, inputSectionType, inputUnits, inputClasses, inputSectionStatus, inputSectionDatabaseId, inputCourseDatabaseId) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    const courseID = inputCourseID;
    const courseName = inputCourseName;
    const sectionName = inputSectionName;
    const sectionType = inputSectionType;
    const sectionStatus = inputSectionStatus;
    const sectionDatabaseId = inputSectionDatabaseId;
    const courseDatabaseId = inputCourseDatabaseId;
    const classes = inputClasses;
    const units = inputUnits;

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

    /** Get classes of this section
     * 
     * @returns {object} {'1': Class, '2': Class}
     */
    function getClasses () {
        return classes;
    }

    function getSectionStatus() {
        return sectionStatus;
    }

    /** Get section ID of section
     * @returns {string} section ID 
     */
    function getSectionDatabaseId() {
        return sectionDatabaseId;
    }

    /** Get courseID of section
    * @returns {string} course ID (e.g. COMP-0015)
    */
    function getCourseDatabaseId () {
        return courseDatabaseId;
    }

    function getUnits () {
        return units;
    }

    return {
        getCourseID,
        getSectionName,
        getSectionType,
        getCourseName,
        getClasses,
        getSectionStatus,
        getSectionDatabaseId,
        getCourseDatabaseId,
        getUnits
    }
}

module.exports = Section;