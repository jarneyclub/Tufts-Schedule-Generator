/** Course class definition
 * @param {string} inputCourseName 
 * @param {list} inputListSections 
 * @param {list} inputListSectionTypes 
 * @returns 
 */
function Course (inputCourseName, inputListSections, inputListSectionTypes) {
    
    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////
    
    var sections = {};
    /* e.g.
    {
        "Lecture": [Section, Section],
        "Laboratory": [Section]
    }
    */
    const courseName = inputCourseName;
    populateSections();

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

    /** Get name of course
     * @returns {string} name of course
     */
    function getCourseName() {
        return courseName;
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
        getCourseName
    }
}

module.exports = Course;