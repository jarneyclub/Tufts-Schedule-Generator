// get random course
const getRandomCourse = (courseDictionary, courseIDs, coursesTotal) => {
    var numberOfCourses = coursesTotal;
    var randomIndex = randomIntegerBetween(0, numberOfCourses-1);
    
    var randomID = courseIDs[randomIndex];
    console.log(courseIDs)
    return courseDictionary[randomID];

}
// generate a randomInteger that is greater than lowerBound
// May block code
// Note: lowerBound must be (0-2400)
const randomIntegerBetween = (lowerBound, upperBound) => {
    var randomIntCandidate = Math.random() * upperBound;

    while (randomIntCandidate <= lowerBound) {
        randomIntCandidate = Math.random() * upperBound;
    }

    return parseInt(randomIntCandidate);
}

exports.getRandomCourse = getRandomCourse;
exports.randomIntegerBetween = randomIntegerBetween;