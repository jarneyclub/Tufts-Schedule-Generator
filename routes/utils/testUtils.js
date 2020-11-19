// get random course

// generate a randomInteger that is greater than lowerBound
// May block code
// Note: lowerBound must be (0-2400)
const randomIntegerBetween = (lowerBound, upperBound) => {
    var randomIntCandidate = Math.random() * upperBound;

    while (randomIntCandidate <= lowerBound) {
        randomIntCandidate = Math.random() * upperBound;
    }

    return randomIntCandidate;
}

