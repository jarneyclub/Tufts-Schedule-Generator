/** sort arrayDigits
 * 
 * @param {array} arrayDigits 
 * @param {integer} maxEntryExcluding 
 * @returns an object with an array of references and sorted array
 */
const countingSort = (arrayDigits, maxEntryExcluding) => {
    var arrayCounting = [];

    // initialize counting array for counting sort
    for (let i = 0; i < maxEntryExcluding; i++) {
        arrayCounting.push([]);
    }

    var arrayObjects = [];
    // iterate through indices in arrayDigits
    for (let i = 0; i < arrayDigits.length; i++) {
        let object = {
            "realIndex": undefined,
            "value": undefined
        };

        object.realIndex = i;
        object.value = arrayDigits[i];

        arrayObjects.push(object);
    }

    // recursively sort arrayObjects
    countingSortHelper(arrayObjects, arrayCounting);

    // iterate through the sorted objects
    let arraySorted = [];
    let mapReferences = {};

    let indexReference = 0;
    for (let i = 0; i < arrayCounting.length; i++) {
        let index = arrayCounting[i];

        for (let j = 0; j < index.length; j++) {
            let object = index[j];

            arraySorted.push(object.value);

            mapReferences[object.realIndex] = indexReference;
            indexReference++;
        }
    }

    let toReturn = {
        "references": mapReferences,
        "sorted": arraySorted
    }

    return toReturn;
}

/** Helper function for counting sort
 * 
 * @param {array} arrayObjects 
 * @param {array} arrayCounting 
 */
const countingSortHelper = (arrayObjects, arrayCounting) => {
    if (arrayObjects.length < 1)
        return

    let firstEntry = arrayObjects[0];
    let value = firstEntry.value;
    arrayCounting[value].push(firstEntry);

    arrayObjects.shift();

    countingSortHelper(arrayObjects, arrayCounting);
}

exports.countingSort = countingSort;