/** INCLUSIVELY checks if [beginInside, endInside] is within [beginOutside, endOutside];
 * Assumption: begin < end
 * @param {any} beginOutside 
 * @param {any} endOutside 
 * @param {any} beginInside 
 * @param {any} endInside 
 */
const withinBounds = (beginOutside, endOutside, beginInside, endInside) => {
    if (beginOutside <= beginInside && endInside <= endOutside)
        return true;
    else
        return false;
}

const filterSections = (mapSectionTypes, filtersMisc) => {
    for (let secType in mapSectionTypes) {
    }
}