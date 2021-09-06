/** Course class definition
 * @param {string} inputCourseId
 * @param {string} inputCourseName 
 * @param {list} inputListSectionTypes 
 * @param {list} inputListSections 
 * @param {number} inputUnits 
 * @param {string} inputCourseDatabaseId
 * @returns 
 */
function Course (inputCourseId, inputCourseName, 
                    inputListSectionTypes, inputSections, 
                    inputUnits, inputCourseDatabaseId) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////
    
    var sections = inputSections;
    /* e.g.
    {
        "Lecture": [Section, Section],
        "Laboratory": [Section]
    }
    */
    const courseName       = inputCourseName;
    const courseID         = inputCourseId;
    const sectionTypes     = inputListSectionTypes;
    const units            = inputUnits;
    const courseDatabaseId = inputCourseDatabaseId;
    // populateSections();

    //////////////////////////////////////////
    //                                      //
    //          Public Functions            //
    //                                      //
    //////////////////////////////////////////

    /** Get Sections
     * @returns {object} sections
     */
    function getSections() {
        return sections;
    }

    /** Get a list of Sections by section type
     * @param {any} type 
     * @returns {list} list of Section objects
     */
    function getSectionsByType(type) {
        return sections[type];
    }

    /** Get id of course
    * @returns {string} id of course
    */
    function getCourseID() {
        return courseID;
    }

    /** Get name of course
     * @returns {string} name of course
     */
    function getCourseName() {
        return courseName;
    }

    /** Get section types
     * @returns {list} list of section types
     */
    function getSectionTypes() {
        return sectionTypes;
    }

    /** Get amount of units for this section
     * @returns {number} number of units
     */
    function getUnits() {
        return units;
    }

    /** 
     * @returns {string} course database id
     */
    function getCourseDatabaseId() {
        return courseDatabaseId;
    }

    return {
        getSections,
        getSectionsByType,
        getCourseName,
        getCourseID,
        getSectionTypes,
        getUnits,
        getCourseDatabaseId
    }
}

module.exports = Course;