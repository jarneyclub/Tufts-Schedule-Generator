const { Heap } = require('heap-js');

function aa () {
    let dayPreferences = [
        { time_earliest: 600, time_latest: 660 },
        { time_earliest: 660, time_latest: 720 },
        { time_earliest: 720, time_latest: 780 },
        { time_earliest: 480, time_latest: 540 },
        { time_earliest: 540, time_latest: 600 }
    ];

    let numIntervals = dayPreferences.length;
    const customPriorityComparator = (a, b) => a.time_earliest - b.time_earliest;
    const priorityQueue = new Heap(customPriorityComparator);
    priorityQueue.init(dayPreferences);
    let result = Heap.nsmallest(numIntervals, priorityQueue)
    console.log(result)
}

aa();