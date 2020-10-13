const to_test = require("../routes/utils/makeSchedule");
const fs = require('../routes/fs/read_file.js');

async function makeAllPossibleSchedule(courseNames, callback) {
    
    fs.get_json( async function (err, courses_json) {

        var allPossibleSchedule;
        
        // iterate over selected courses
        for ( var courseIndex in courseNames ) {
            
            // get all the section types of this course
            var courseName = courseNames[index];
            console.log(courses_json.courses[courseName]);
            var sectionTypes = courses_json.courses[courseName].section_types;

            var totalSections;
            // iterate over the section types
            for ( var sectionTypeInd in sectionTypes ) {

                var sectionType = sectionTypes[sectionTypeInd];
                var sectionOptions = courses_json.courses[courseName][sectionType]; // get the section options (array of sections)
                
                var sectionOptionsLen = sectionOptions.length;

                for ( var sectionInd in sectionOptions ) {

                    var section = sectionOptions[sectionInd];
                    
                }

            }
        }
    })
}

/*


base case: 

*/

var courseNames = ["COMP-0040", "MATH-0042", "COMP-0020", "EM-0054", "PSY-0028"];

function getCombn(arr, pre) {
    pre = pre || '';
    if (!arr.length) {
        return pre;
    }
    var ans = arr[0].reduce(function (ans, value) {
        return ans.concat(getCombn(arr.slice(1), pre + value));
    }, []);
    return ans;
} 
// makeAllPossibleSchedule(courseNames);
var arr = [
    ['m', 'n'],
    ['c'],
    ['d', 'e', 'f']
]; 

var arr = ['a','b','c'];
var arr2 = ['d'];

// arr.reduce(function( acc, value ) {
    // console.log("acc", acc);
    // console.log("value",value);
// })

console.log(arr2.slice(1));