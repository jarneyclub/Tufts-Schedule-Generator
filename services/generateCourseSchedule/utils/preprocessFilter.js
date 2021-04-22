const { Heap } = require('heap-js');

/** Combine adjacent time intervals in the time preferences section
 * of filter. e.g. 10:00-11:00, 11:00-12:00 should be 10:00-12:00
 * 
 * @param {object} global 
 */
const joinAdjacentTimesInFilter = (global) => {
    return new Promise((resolve, reject) => {
        let filter = global.filter;
        let preferencesTime = filter.time;

        // console.log("(preprocessFilter) timePref before: ", preferencesTime);

        for (let day in preferencesTime) {

            /* iterate through the days of the week in time preferences */
            let dayPreferences = preferencesTime[day];
            
            let numIntervals = dayPreferences.length;

            // Sort time intervals in dayPreferences by earliest_time
            const customPriorityComparator = (a, b) => a.time_earliest - b.time_earliest;
            const priorityQueue = new Heap(customPriorityComparator);
            priorityQueue.init(dayPreferences);
            dayPreferences = Heap.nsmallest(numIntervals, priorityQueue)

            let index = 0;
            let previousTimeLatest = undefined;

            // iterate through the specified time intervals in the day
            while (index < numIntervals) {
                let interval = dayPreferences[index];
                let timeEarliest = interval.time_earliest;
                let timeLatest = interval.time_latest;

                if (timeEarliest === previousTimeLatest) {
                    
                    /* join current and previous intervals */

                    // combine current interval into the previous interval
                    let previousInterval = dayPreferences[index - 1];
                    previousInterval.time_latest = timeLatest;

                    // remove current interval from array
                    // console.log("dayPreferences before splice: ", dayPreferences)
                    dayPreferences.splice(index, 1);
                    // console.log("dayPreferences after splice: ", dayPreferences)

                    previousTimeLatest = timeLatest; // update join condition
                    numIntervals--;
                }
                else {
                    /* keep current and previous intervals seperate */

                    previousTimeLatest = timeLatest; // update join condition

                    index++;
                }
            }

            // update the time filter's day of preferences
            preferencesTime[day] = dayPreferences;

        }
        // console.log("(preprocessFilter) timePref after: ", preferencesTime);

        resolve(global);
    });
}

exports.joinAdjacentTimesInFilter = joinAdjacentTimesInFilter;