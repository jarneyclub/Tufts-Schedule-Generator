const integerToMilitaryTime = (input) => {

    if (input == -1) {
        let result = "Time not specified";
        return result;
    }
    else {
        let intHour = Math.floor(input / 60);
        let intMinutes = input % 60;

        let strHour;
        let strMin;
        if (intHour < 10)
            strHour = "0" + intHour.toString();
        else
            strHour = intHour.toString();

        if (intMinutes < 10)
            strMin = "0" + intMinutes.toString();
        else
            strMin = intMinutes.toString();
        let result = strHour + ":" + strMin;
        return result;
    }
}

const militaryTimeToInteger = (input) => {
    let splitTime = input.split(/[:]/g);

    let intHour = parseInt(splitTime[0]);
    let intMinutes = parseInt(splitTime[1]);

    let result = intHour * 60 + intMinutes;

    return result;
}

exports.integerToMilitaryTime = integerToMilitaryTime;
exports.militaryTimeToInteger = militaryTimeToInteger;