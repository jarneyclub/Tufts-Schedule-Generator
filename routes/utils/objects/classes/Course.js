/** Course class definition
 * @param {string} inputCourseId
 * @param {string} inputCourseName 
 * @param {list} inputListSectionTypes 
 * @param {list} inputListSections 
 * @returns 
 */
function Course (inputCourseId, inputCourseName, inputListSectionTypes, inputSections) {
    
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
    const courseName = inputCourseName;
    const courseID = inputCourseId;
    const sectionTypes = inputListSectionTypes;

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

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////
    
    function populateSections () {

        // initialize sections variable with section types
        for (var index in inputListSectionTypes) {
            var sectionType = inputListSectionTypes[index];
            sections[sectionType] = [];
        }

        // assign an unsorted list of Sections by section type
        for (var index in inputListSections) {
            var section = inputListSections[index]; // a single Section object
            var sectionType = section.getSectionType();

            sections[sectionType].push(section);
        }
    }


    return {
        getSections,
        getSectionsByType,
        getCourseName,
        getCourseID,
        getSectionTypes
    }
}

module.exports = Course;