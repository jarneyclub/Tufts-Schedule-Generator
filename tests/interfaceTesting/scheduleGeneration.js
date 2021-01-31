const testSchedule = (option, objectIds, callback) => {
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
        objectIds: objectIds,
        filter: {
            "time": {
                "Monday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Tuesday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Wednesday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Thursday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Friday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Saturday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ],
                "Sunday": [
                    { "time_earliest": "12:00", "time_latest": "23:59" }
                ]
            }
        }
    };

    xhr.setRequestHeader("Content-type", "application/json");

    var bodyStringified = JSON.stringify(body);

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
            
            console.log("SCHEDULE: ", data);

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
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Tuesday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Wednesday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Thursday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Friday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Saturday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ],
                "Sunday": [
                    { "time_earliest": "08:00", "time_latest": "23:59" }
                ]
            }
        }
    };

    xhr.setRequestHeader("Content-type", "application/json");

    var bodyStringified = JSON.stringify(body);

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

            console.log("SCHEDULE: ", data);

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