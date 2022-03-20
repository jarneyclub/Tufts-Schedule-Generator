const { Heap } = require('heap-js');
const timeUtils = require('./timeUtils.js');

/**
 * Convert time preferences that is in military time
 * to number of minutes since midnight. 
 * e.g. 10:00 should be converted to 600
 * @param {object} objDaysOfWeekInMilitary object formatted like below
 * {
 *     Monday: [{time_earliest: 08:00, time_latest: 08:30}, ...],
 *    Tuesday: [{time_earliest: 10:00, time_latest: 11:30}, ...],
 *   ...
 * }
 * @return {object} object of converted time preferences
 */
const convertTimeFromMilitaryToMinutes = (objDaysOfWeekInMilitary) => {
    let dayToInteger = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
        "Sunday": 7
    };
    // Iterate over each day of the week in the object and convert
    // the time preferences to minutes since midnight
    let convertedTime = {};
    for (let dayString in objDaysOfWeekInMilitary) {
        convertedTime[dayToInteger[dayString]] = [];
        for (let i = 0; i < objDaysOfWeekInMilitary[dayString].length; i++) {
            // Convert time to minutes since midnight
            let strTimeEarliest = objDaysOfWeekInMilitary[dayString][i].time_earliest;
            let strTimeLatest = objDaysOfWeekInMilitary[dayString][i].time_latest;
            convertedTime[dayToInteger[dayString]].push({
                time_earliest: timeUtils.militaryTimeToInteger(strTimeEarliest),
                time_latest: timeUtils.militaryTimeToInteger(strTimeLatest)
            });
        }
    }
    return convertedTime;
}


const preprocessFilter = (global) => {
    return new Promise((resolve, reject) => {
        console.log("(preprocessFilter) preprocessing filter now ");

        let dayToInteger = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 7
        }
        global.filterPreprocessed = {
            time: convertTimeFromMilitaryToMinutes(global.filter.time),
            misc: global.filter.misc
        }
        
        // console.log("(preprocessFilter) timePref before convert to int: ", global.filter.time);
        
        /*    Combine adjacent time intervals in the time preferences section of filter.
             e.g. 10:00-11:00, 11:00-12:00 should be 10:00-12:00                     
        */
        // console.log("(preprocessFilter) global.filterPreprocessed.time after conversion: ", global.filterPreprocessed.time);
        // console.log("(preprocessFilter) timePref before: ", global.filterPreprocessed.time);
        for (let day in global.filterPreprocessed.time) {

            /* iterate through the days of the week in time preferences */
            let dayPreferences = global.filterPreprocessed.time[day];

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
            global.filterPreprocessed.time[day] = dayPreferences;

        }
        // console.log("(preprocessFilter) global.filterPreprocessed after: ", global.filterPreprocessed.time);
        // console.log("(preprocessFilter) global.filter after: ", global.filter);

        resolve(global);
    });
}

module.exports = preprocessFilter;