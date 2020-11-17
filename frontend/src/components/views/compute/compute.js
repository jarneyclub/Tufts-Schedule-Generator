function median(x, y) {
    
}

//returns the median of three values
function median(start, end, comparison) {
    var array = [start, end, comparison];
    array.sort(function(a,b){return a - b});
    //array.sort;
    var result;
    if (array.length == 0) {
        return -1;
    }
    //if array length is even
    if (array.length%2 == 0) {
        while (array.length > 2) {
            array.pop();
            document.write(array.length);
            array.shift();
            document.write(array.length);
        }
        result = (array[0] + array[1])/2;
    }
    else {
        while (array.length > 1) {
            array.pop();
            document.write(array.length);
            array.shift();
            document.write(array.length);
        }
        result = array[0];
    }
    return result;
}


//returns true if Time1 and Time2 overlaps
function overlaps(Time1, Time2) {
    //if the difference is not zero, the times overlap
    function difference(Time1, Time2) {
        return median(Time1.startTime, Time1.endTime, Time2.startTime) -
        median(Time1.startTime, Time1.endTime, Time2.endTime);
    }
    
    if (Time1.day == Time2.day) {
        if (difference(Time1,Time2) != 0) { return true; }
        else { return false; }
    }
    else { return false; }
}