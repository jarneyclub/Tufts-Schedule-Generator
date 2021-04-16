/** Combine adjacent time intervals in the time preferences section
 * of filter. e.g. 10:00-11:00, 11:00-12:00 should be 10:00-12:00
 * 
 * @param {object} global 
 */
const joinAdjacentTimesInFilter = (global) => {
    return new Promise((resolve, reject) => {
        let filter = global.filter;
        let preferencesTime = filter.time;

        console.log("(preprocessFilter) timePref before: ", preferencesTime);

        for (let day in preferencesTime) {

            /* iterate through the days of the week in time preferences */
            let dayPreferences = preferencesTime[day];
            let numIntervals = dayPreferences.length;
            let index = 0;
            let previousTimeLatest = undefined;

            while (index < numIntervals) {
                /* iterate through the specified time intervals in the day */
                let interval = dayPreferences[index];
                let timeEarliest = interval.time_earliest;
                let timeLatest = interval.time_latest;

                if (timeEarliest === previousTimeLatest) {
                    // combine current interval into the previous interval
                    let previousInterval = dayPreferences[index - 1];
                    previousInterval.time_latest = timeLatest;

                    // remove current interval from array
                    dayPreferences.splice(index, 1);

                    previousTimeLatest = timeLatest; // update join condition
                    numIntervals--;
                }
                else {
                    // keep current and previous intervals seperate

                    previousTimeLatest = timeLatest; // update join condition

                    index++;
                }
            }

        }
        console.log("(preprocessFilter) timePref after: ", preferencesTime);

        resolve(global);
    });
}

exports.joinAdjacentTimesInFilter = joinAdjacentTimesInFilter;