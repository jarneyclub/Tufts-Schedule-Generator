/* Helper Functions */

const createDRPublic = async (option, token, body) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/public";

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

const getDRPublics = async (option, token) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereqs/public";

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

const deleteDRPublic = async (option, token, pubDrId) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/public/" + pubDrId;

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

const copyDRPublicToPrivate = async (option, token, pubDrId) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/public/copy/" + pubDrId;

        let url;
        if (option == "DEV")
            url = BASEURL_DEVELOPMENT + endpoint;
        else if (option == "PROD")
            url = BASEURL_PRODUCTION + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
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

const createDRPrivate = async (option, token, body) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/private";

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

const getDRPrivates = async (option, token) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereqs/private";

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

const getDRPrivate = async (option, token, privDrId) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/private/" + privDrId;

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

const deleteDRPrivate = async (option, token, privDrId) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/private/" + privDrId;
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

const saveDRPrivate = async (option, token, body) => {
    return new Promise(function (resolve, reject) {
        let endpoint = "/degreereq/private/save";

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

const drAppLogicTest = async (option, token) => {
    let testPassing = true;
    let DRPublicBody = {
        "program_name": "test program",
        "school": "school of bussin",
        "degree": "can i get a hoya",
        "parts": [
            {
                "part_name": "important part",
                "part_desc": "you need to do this",
                "part_reqs": [
                    {
                        "course_num": "CS-0011",
                        "course_title": "Intro to Comp Sci"
                    }
                ]
            }
        ]
    }
    // Create Public Degree Requirement
    let res1 = await createDRPublic(option, token, DRPublicBody);
    if (res1.err !== undefined) {
        /* res1 response is error */
        testPassing = false;
        console.error("(drAppLogicTest) FAILED. createDRPublic response error: ", res);
    }
    else {
        /* res1 response is valid */
        console.log("(drAppLogicTest) createDRPublic passed. ");
        // Get a list of Public Degree Requirements
        let res2 = await getDRPublics (option, token);
        if (res2.err !== undefined) {
            /* res2 response is error */
            testPassing = false;
            console.error("(drAppLogicTest) FAILED. getDRPublics response error: ", res2);
        }
        else {
            /* res2 response is valid */
            console.log("(drAppLogicTest) getDRPublics passed. ");
            // look for the added public degree req
            let addedReq;
            for (let i = 0; i < res2.reqs.length; i++) {
                let currReq = res2.reqs[i];
                if (currReq.program_name === "test program") {
                    addedReq = currReq;
                }
            }

            if (addedReq === undefined) {
                testPassing = false;
                console.error("(drAppLogicTest) FAILED. added public degree requirement not found: ", res2.reqs);
            }

            // Copy into private requirement
            let res3 = await copyDRPublicToPrivate(option, token, addedReq.pub_dr_id)
            if (res3.err !== undefined) {
                /* res3 response is error */
                testPassing = false;
                console.error("(drAppLogicTest) FAILED. copyDRPublicToPrivate response error: ", res2);
            }
            else {
                /* res3 response is valid */
                console.log("(drAppLogicTest) copyDRPublicToPrivate passed. ");
                // Get a list of private requirements
                let res4 = await getDRPrivates(option, token);
                if (res4.err !== undefined) {
                    /* res4 response is error */
                    testPassing = false;
                    console.error("(drAppLogicTest) FAILED. getDRPrivates response error: ", res4);
                }
                else {
                    /* res4 response is valid */
                    console.log("(drAppLogicTest) getDRPrivates passed. ");
                    // Get a private requirement (of first in the list but in api call)
                    let res5 = await getDRPrivate(option, token, res4.reqs[0].priv_dr_id);
                    if (res5.err !== undefined) {
                        /* res5 response is error */
                        testPassing = false;
                        console.error("(drAppLogicTest) FAILED. getDRPrivate response error: ", res5);
                    }
                    else {
                        /* res5 response is valid */
                        console.log("(drAppLogicTest) getDRPrivate passed. ");
                        // Change and save private requirement
                        res5.req.parts.push({
                            part_name: "ooga ooga",
                            part_desc: "hoya",
                            part_reqs: [
                                {course_num  :  "BB-0001",
                                course_title : "hey" }
                            ] 
                        })
                        let saveBody = {
                            priv_dr_id   : res5.req.priv_dr_id,
                            program_name : res5.req.program_name,
                            school       : res5.req.school,
                            degree       : res5.req.degree,
                            parts        : res5.req.parts
                        }
                        let res6 = await saveDRPrivate (option, token, saveBody);
                        if (res6.err !== undefined) {
                            /* res6 response is error */
                            testPassing = false;
                            console.error("(drAppLogicTest) FAILED. saveDRPrivate response error: ", res6);
                        }
                        else {
                            /* res6 response is valid */
                            console.log("(drAppLogicTest) saveDRPrivate passed. ");
                            // Delete private requirement
                            let res7 = await deleteDRPrivate (option, token, res5.req.priv_dr_id);
                            if (res7.err !== undefined) {
                                /* res7 response is error */
                                testPassing = false;
                                console.error("(drAppLogicTest) FAILED. deleteDRPrivate response error: ", res7);
                            }
                            else {
                                // Delete Public Degree Requirement
                                console.log("(drAppLogicTest) deleteDRPrivate passed. ");
                                let res8 = await deleteDRPublic(option, token, addedReq.pub_dr_id);
                                if (res8.err !== undefined) {
                                    /* res8 response is error */
                                    testPassing = false;
                                    console.error("(drAppLogicTest) FAILED. deleteDRPublic response error: ", res8);
                                }
                                else {
                                    console.log("(drAppLogicTest) deleteDRPublic passed. ");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return testPassing
}

const drCreatePrivateTest = async (option, token) => {
    let testPassing = true;
    let DRPrivateBody = {
        "program_name": "test private program",
        "school": "school of bussin",
        "degree": "can i get a hoya",
        "parts": [
            {
                "part_name": "important part",
                "part_desc": "you need to do this",
                "part_reqs": [
                    {
                        "course_num": "CS-0011",
                        "course_title": "Intro to Comp Sci"
                    }
                ]
            }
        ]
    }
    // Create Public Degree Requirement
    let res1 = await createDRPrivate(option, token, DRPrivateBody);
    if (res1.err !== undefined) {
        /* res1 response is error */
        testPassing = false;
        console.error("(drCreatePrivateTest) FAILED. createDRPrivate response error: ", res1);
    }
    else {
        // Get a list of private requirements
        console.log("(drCreatePrivateTest) createDPPrivate passed. ");
        let res4 = await getDRPrivates(option, token);
        if (res4.err !== undefined) {
            /* res4 response is error */
            testPassing = false;
            console.error("(drCreatePrivateTest) FAILED. getDRPrivates response error: ", res4);
        }
        else {
            /* res4 response is valid */
            console.log("(drCreatePrivateTest) getDRPrivates passed. ");
            // Get a private requirement (of first in the list but in api call)
            let res5 = await getDRPrivate(option, token, res4.reqs[0].priv_dr_id);
            if (res5.err !== undefined) {
                /* res5 response is error */
                testPassing = false;
                console.error("(drCreatePrivateTest) FAILED. getDRPrivate response error: ", res5);
            }
            else {
                /* res5 response is valid */
                let res7 = await deleteDRPrivate(option, token, res5.req.priv_dr_id);
                if (res7.err !== undefined) {
                    /* res7 response is error */
                    testPassing = false;
                    console.error("(drCreatePrivateTest) FAILED. deleteDRPrivate response error: ", res7);
                }
                else {
                    console.log("(drCreatePrivateTest) deleteDRPrivate passed. ");
                }
            }
        }
    }

    return true
}

const comprehensiveDrTests = async (option, token) => {
    let testPassing;
    
    testPassing = await drAppLogicTest(option, token);

    testPassing = await drCreatePrivateTest(option, token);

    return testPassing
}
