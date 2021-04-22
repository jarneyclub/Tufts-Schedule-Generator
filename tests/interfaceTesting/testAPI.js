const BASEURL_PRODUCTION = "https://tufts-schedule-api.herokuapp.com/api";
const BASEURL_DEVELOPMENT = "http://localhost:7777/api";

const testGetOidOfCourseId = (option, courseId) => {

    let endpoint = "/courses/docs/course-id/" + courseId;

    let url;
    if (option == "DEV") {
        url = BASEURL_DEVELOPMENT + endpoint;
    }
    else if (option == "PROD") {
        url = BASEURL_PRODUCTION + endpoint;
    }

    return new Promise( (resolve, reject) => {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.send();

        xhr.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {

                let response = JSON.parse(this.responseText);
                // console.log(response);

                resolve(response.data.documents);
            }
            else if (this.status == 400) {

                let response = JSON.parse(this.responseText);
                console.error(response);

                reject(Error(response));
            }
        };

    });
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

const testRegister = (option, callback) => {

    let endpoint = "/auth/register";

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
        name: "jeremy",
        email: "aaa@gmail.com",
        email_confirmation: "aaa@gmail.com",
        password: "12345"
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

            console.log(this.responseText);

            result.TEST_PASSED = true;

            callback(result);
        }
        else if (this.status == 400) {

            console.log("Error: ", this.responseText);

            result.TEST_PASSED = false;

            callback(result);
        }
    };
}

const testMeetupAuth = (option, callback) => {
    let BASEURL_MEETUP = "https://secure.meetup.com";
    let endpoint = "/oauth2/authorize";

    let url;

    url = BASEURL_MEETUP + endpoint;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.send();

    xhr.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let response = JSON.parse(this.responseText);
            console.log(response);

            callback(result);
        }
        else if (this.status == 400) {

            let response = JSON.parse(this.responseText);
            console.log(response);

            callback(result);
        }
    };
}

const testMeetupGet = (option, callback) => {
    let BASEURL_MEETUP = "https://api.meetup.com";
    let endpoint = "/find/upcoming_events";

    let url;

    url = BASEURL_MEETUP + endpoint;

    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.send();

    xhr.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            let response = JSON.parse(this.responseText);
            console.log(response);

            callback(result);
        }
        else if (this.status == 400) {

            let response = JSON.parse(this.responseText);
            console.log(response);

            callback(result);
        }
    };
}

const runTests = async (option) => {

    // testScheduleBasic(option, function (result) {
    //     if (result.TEST_PASSED)
    //         console.log("testScheduleBasic PASSED in", result.RESPONSE_TIME);
    //     else
    //         console.log("testScheduleBasic FAILED");
    // });

    testSearchTable(option, function (result) {
        if (result.TEST_PASSED)
            console.log("testSearchTable PASSED in", result.RESPONSE_TIME);
        else
            console.log("testSearchTable FAILED");
    });
    
    let arrayDocs = [];
    /* Overlappign courses combo */
    arrayDocs.push(await testGetOidOfCourseId(option, "CS-0015"));
    arrayDocs.push(await testGetOidOfCourseId(option, "CS-0040"));
    arrayDocs.push(await testGetOidOfCourseId(option, "BIO-0013"));
    arrayDocs.push(await testGetOidOfCourseId(option, "CHEM-0001"));

    let arrayOids = [];
    for (let i in arrayDocs) {
        let documents = arrayDocs[i];
        let randomIndex = Math.floor(Math.random() * documents.length);

        let docRandom = documents[randomIndex];
        try {
            let oid = docRandom._id;
            arrayOids.push(oid);
        }
        catch (e) {
            console.error(e);
            console.log("documents: ", documents);
            console.log("randomIndex: ", randomIndex);
            console.log("documents.length: ", documents.length);
        }
    }
    console.log(arrayOids)
    testSchedule(option, arrayOids, function (result) {
        if (result.TEST_PASSED)
            console.log("test schedule with overlapping case? PASSED in", result.RESPONSE_TIME);
        else
            console.log("test schedule with overlapping case? FAILED");
    });
    // testRegister(option, function(result) {
    //     if (result.TEST_PASSED)
    //         console.log("testRegister PASSED in", result.RESPONSE_TIME);
    //     else
    //         console.log("testRegister FAILED");
    // })
    
    // testMeetupAuth(option, function(result){})
    // testMeetupGet(option, function (result) {
// 
    // })

}