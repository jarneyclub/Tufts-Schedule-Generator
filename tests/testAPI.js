const BASEURL_PRODUCTION = "https://tufts-schedule-api.herokuapp.com/api";
const BASEURL_DEVELOPMENT = "http://localhost:7777/api";

const integerToMilitaryTime = (input) => {
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

const militaryTimeToInteger = (input) => {
    let splitTime = input.split(/[:]/g);

    let intHour = parseInt(splitTime[0]);
    let intMinutes = parseInt(splitTime[1]);

    let result = intHour * 60 + intMinutes;

    return result;
}

const testScheduleBasic = (option, callback) => {
    let endpoint = "/courses/schedule";
    
    let url;

    if (option == "DEV") {
        url = BASEURL_DEVELOPMENT + endpoint;
    }
    else if (option == "PROD") {
        url = BASEURL_PRODUCTION + endpoint;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    var body = {
        objectIds: [
            "5ff7cb917050e1e1f4a1495a", "5ff7cb917050e1e1f4a148e5", "5ff7cb917050e1e1f4a1481a", "5ff7cb917050e1e1f4a14891", "5ff7cb917050e1e1f4a14e37"
        ],
        filter: {
            "time": {
                "Monday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Tuesday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Wednesday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Thursday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Friday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Saturday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ],
                "Sunday": [
                    {"time_earliest": "09:00", "time_latest": "23:59"}
                ]
            }
        }
    };

    xhr.setRequestHeader("Content-type", "application/json");

    var bodyStringified = JSON.stringify(body);
    
    console.log("bodyStringified: ", bodyStringified);
    
    xhr.send(bodyStringified);

    xhr.onreadystatechange = function () {
        let result = {
            TEST_PASSED: true,
            RESPONSE_TIME: ""
        };

        if (this.readyState == 4 && this.status == 200) {
            
            let response = JSON.parse(this.responseText);

            result.RESPONSE_TIME = response.time_taken;
            let data = response.data;

            /* check if time preference was correctly applied */

            // iterate through days 
            for (let key in data) {

                if (key != "Unscheduled") {

                    let day = data[key];

                    // iterate through classes
                    for (let i = 0; i < day.length; i++) {

                        let aClass = day[i];

                        if (aClass != undefined) {

                            let startTime = aClass.time_start;
                            let endTime = aClass.time_end;

                            try {
                                let intStartTime = militaryTimeToInteger(startTime);
                                let intEndTime = militaryTimeToInteger(endTime);

                                if (!(intStartTime >= 540 && intEndTime <= 1439)) {
                                    result.TEST_PASSED = false;
                                    console.log("ERROR! class name:", aClass.name);
                                    console.log("day in: ", key);
                                    console.log("intStartTime: ", intStartTime);
                                }
                            }
                            catch (e) {
                                console.log("Error: ", e);
                                console.log("Course name: ", aClass.details);
                                console.log("Section name: ", aClass.name);
                            }
                        }
                    }
                }
            }

            callback(result);
        }
        else if (this.status == 400) {
            
            console.log("Error: ", this.responseText);

            result.TEST_PASSED = false;

            callback(result);
        }
    };
}

const testSearchTable = (option, callback) => {
    let endpoint = "/courses/alg/search-table";

    let url;

    if (option == "DEV") {
        url = BASEURL_DEVELOPMENT + endpoint;
    }
    else if (option == "PROD") {
        url = BASEURL_PRODUCTION + endpoint;
    }

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.send();

    xhr.onreadystatechange = function () {

        let result = {
            TEST_PASSED: true,
            RESPONSE_TIME: ""
        };

        if (this.readyState == 4 && this.status == 200) {
            
            let response = JSON.parse(this.responseText);
            console.log(response);

            let data = response.data;
            if (data)
                result.RESPONSE_TIME = response.time_taken;
            callback(result);
        }
        else if (this.status == 400) {
            
            let response = JSON.parse(this.responseText);
            console.log(response);

            callback(result);
        }
    };
}

const runTests = (option) => {

    testScheduleBasic(option, function (result) {
        if (result.TEST_PASSED)
            console.log("testScheduleBasic PASSED in", result.RESPONSE_TIME);
        else
            console.log("testScheduleBasic FAILED");
    });

    testSearchTable(option, function (result) {
        if (result.TEST_PASSED)
            console.log("testSearchTable PASSED in", result.RESPONSE_TIME);
        else
            console.log("testSearchTable FAILED");
    });

}