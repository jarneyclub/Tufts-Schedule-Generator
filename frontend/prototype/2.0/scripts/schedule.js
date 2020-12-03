/* Needs to load after DOM rendering*/

function addSectionToDisplay(day, startTime, endTime) {
    var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    
    var exampleclass = document.createElement("div");
    exampleclass.classList.add("classtemplate");

    var positionStartTime = accountForBorderHeightAccumulation(
        beginPixelsFromSevenAM(
            convertTimeToPixels(startTime)
        )
    );

    var positionEndTime = accountForBorderHeightAccumulation(
        beginPixelsFromSevenAM(
            convertTimeToPixels(endTime)
        )
    )

    /* construct the section element to add to week */
    // top position = startTime - (120px/hour)*(7 hour) since it starts at 7AM
    exampleclass.style.top = positionStartTime + "px";
    console.log("pixel top position of section: ")

    var positionDifference = (positionEndTime - positionStartTime); // in pixels
    var height_amount = positionDifference;
    // account for accumulated border heights that extend needed height-amount

    console.log(height_amount)
    exampleclass.style.height = height_amount + "px";

    var startTimeString = getHour(startTime) + ":" + getMinutes(startTime);
    var endTimeString = getHour(endTime) + ":" + getMinutes(endTime);
    exampleclass.innerHTML = startTimeString + " - " + endTimeString;


    //get the hour to add course to
    var given_day = days[day];
    var given_day = document.getElementById(given_day);
    given_day.appendChild(exampleclass);
}

function beginPixelsFromSevenAM(pixels) {
    return pixels - 120 * 7;
}

// account for accumulated pixels from heights of borders when calculating 
// positions
function accountForBorderHeightAccumulation(position) {
    console.log("position/120: ", (position / 120))
    // 9 is a random number, but it worked..
    return (((position / (120 * 7)) * 9) + position);
}

function convertTimeToPixels(timeInMinutes) {
    return timeInMinutes * 2;
}

function getHour(timeInMinutes) {
    return parseInt(Math.floor(timeInMinutes / 60));
}

function getMinutes(timeInMinutes) {
    var minutes = parseInt((timeInMinutes % 60));
    if (minutes < 10) {
        return "0" + minutes;
    }
    else {
        return minutes;
    }
}