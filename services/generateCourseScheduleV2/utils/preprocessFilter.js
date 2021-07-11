const { Heap } = require('heap-js');
const timeUtils = require('./timeUtils.js');

/**
 * Convert the day and the military times in time filter to integers
 * @param {any} timePreferences 
 * @returns 
 */
exports.IntegerifyTimePrefrences = (timePreferences) => {
    let dayToInteger = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    };

    /* Convert military time in filter to integers representing minutes */
    let newTimePreferences 
    for (let dayString in timePreferences) {
        let dayInt = dayToInteger[dayString];
        newTimePreferences[dayInt] = timePreferences[dayString];

        let arrayTimes = newTimePreferences[dayInt];
        for (let i = 0; i < arrayTimes.length; i++) {
            let strTimeEarliest = timePreferences[dayString][i].time_earliest;
            let strTimeLatest = timePreferences[dayString][i].time_latest;

            let intTimeForEarliest = timeUtils.militaryTimeToInteger(strTimeEarliest);
            let intTimeForLatest = timeUtils.militaryTimeToInteger(strTimeLatest);
            newTimePreferences[dayInt][i].time_earliest = intTimeForEarliest;
            newTimePreferences[dayInt][i].time_latest = intTimeForLatest;
        }
    }
    
    return newTimePreferences;
}

/**
 * Sort time preferences provided in each day in the time filter in increasing order
 * @param {object} timePreferences 
 */
exports.sortTimePreferences = (timePreferences) => {
    for (let day in timePreferences) {

        /* iterate through the days of the week in time preferences */
        let dayPreferences = timePreferences[day];

        let numIntervals = dayPreferences.length;

        // Sort time intervals in dayPreferences by earliest_time
        const customPriorityComparator = (a, b) => a.time_earliest - b.time_earliest;
        const priorityQueue = new Heap(customPriorityComparator);
        priorityQueue.init(dayPreferences);
        dayPreferences = Heap.nsmallest(numIntervals, priorityQueue);

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
        timePreferences[day] = dayPreferences;

    }
}