/* Helper Functions */

const testCreateDP = async (option, token, body) => {
    return new Promise (function (resolve, reject) {
        let endpoint = "/degreeplan";

        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testLoadDPs = (option, token) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreeplans";

        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testLoadDP = (option, token, plan_id) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreeplan/" + plan_id;

        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testCreatePlanTerm = async (option, token, body) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreeplan/term/create";

        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testSavePlanTerm = async (option, token, body) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreeplan/term/save";
        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

const testDeletePlan = async (option, token, plan_id) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreeplan/" + plan_id;
        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", token);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(this.responseText));
            else if (this.status === 400 || this.status === 401 || this.status === 403)
                reject(JSON.parse(this.responseText));
        };
    })
}

/* Testing Functions */

// Create Degree Plan, Load Added Degree Plan, then Delete Plan, then check deletion with load plans
const createDPTest = async (option, token) => {
    let testPassing = true;
    // remember previous number of degree plans
    let res0 = await testLoadDPs(option, token);
    let numDegreePlans_i = res0.plans.length;

    let cdpBody = { plan_name: "my plan 1" }
    let res = await testCreateDP(option, token, cdpBody);
    if (res.err !== undefined) {
        // response is error
        testPassing = false;
        console.error("(createDPTest) FAILED. testCreateDP response error: ", res);
    }
    else {
        // response is valid
        if (res.plan.plan_name !== "my plan 1") {
            testPassing = false;
            console.error("(createDPTest) FAILED. plan_name mismatch: ", res);
        }

        // check if there are any repeating terms
        let encounteredTerms = {};
        for (let i = 0; i < res.plan.terms.length; i++) {
            if (encounteredTerms[res.plan.terms[i].term.toString()] !== undefined) {
                testPassing = false;
                console.error("(createDPTest) FAILED. repeated terms: ", res);
            }
            else {
                encounteredTerms[res.plan.terms[i].term.toString()] = 1
            }
        }
        // delete created plan
        let res2 = await testDeletePlan(option, token, res.plan.plan_id);
        if (res2.error !== undefined) {
            testPassing = false;
            console.error("(createDPTest) FAILED. testDeletePlan response error: ", res2);
        }
        else {
            let res3 = await testLoadDPs(option, token);
            if (res3.error !== undefined) {
                testPassing = false;
                console.error("(createDPTest) FAILED. testLoadDPs response error: ", res3);
            }
            else {
                if (res3.plans.length !== numDegreePlans_i) {
                    testPassing = false;
                    console.error("(createDPTest) FAILED. length of plans after deletion mismatch: ", res3);
                }
            }
        }
    }

    return testPassing
}

// Create Degree Plan, create term, load changed degree plan, save term (add course), then delete Plan
const createAndSaveTermTest = async (option, token) => {
    let testPassing = true;

    let cdpBody = { plan_name: "my plan 1" }
    let res = await testCreateDP(option, token, cdpBody);
    if (res.err !== undefined) {
        /* response is error */
        testPassing = false;
        console.error("(createAndSaveTermTest) FAILED. testCreateDP response error: ", res);
    }
    else {
        /* response is valid */
        let res2 = await testCreatePlanTerm(option, token, {
            plan_id : res.plan.plan_id,
            term    : 2175
        })
        if (res2.error !== undefined) {
            /* response is error */
            testPassing = false;
            console.error("(createAndSaveTermTest) FAILED. testCreatePlanTerm response error: ", res2);
        }
        else {
            /* response is valid */
            let res3 = await testSavePlanTerm(option, token, {
                plan_term_id: res2.plan_term_id,
                courses: [{
                    "course_num": "CS-0011",
                    "course_title": "Intro to Computer Science",
                    "units_esti": "4",
                    "gen_course_id": "60b2bcc438f3c5fd4c082857" // PLACEHOLDER
                }]
            });
            if (res3.error !== undefined) {
                /* response is error */
                testPassing = false;
                console.error("(createAndSaveTermTest) FAILED. testSavePlanTerm response error: ", res3);
            }
            else {
                /* response is valid */
                let res4 = await testLoadDP(option, token, res.plan.plan_id);
                if (res4.error !== undefined) {
                    /* response is error */
                    testPassing = false;
                    console.error("(createAndSaveTermTest) FAILED. testLoadDP response error: ", res4);
                }
                else {
                    /* response is valid */

                    // find added courses in degree plan
                    let courseFound = false;
                    for (let i = 0; i < res4.plan.terms.length; i++) {
                        let currTerm = res4.plan.terms[i];
                        if (currTerm.term === 2175) {
                            if (currTerm.courses.length > 0) {
                                if (currTerm.courses[0].course_num === "CS-0011") {
                                    courseFound = true;
                                }
                            }
                        }
                    }
                    
                    if (courseFound === false) {
                        testPassing = false;
                        console.error("(createAndSaveTermTest) FAILED. added course not found: ", res4.plan.terms);
                    }
                }
            }
        }
        // delete created plan
        let res5 = await testDeletePlan(option, token, res.plan.plan_id);
    }

    return testPassing
}

// Create Degree Plan, save term (add course), load changed degree plan, then delete Plan

// Create Degree Plan, create term, delete term, load changed plan, then delete plan

const comprehensiveDpTests = async (option, token) => {
    let testPassing;
    testPassing = await createDPTest(option, token);
    testPassing = await createAndSaveTermTest(option, token);
    return testPassing
}
