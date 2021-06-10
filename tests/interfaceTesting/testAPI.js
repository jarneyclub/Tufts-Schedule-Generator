const BASEURL_PRODUCTION = "https://tufts-schedule-api.herokuapp.com/api";
const BASEURL_DEVELOPMENT = "http://localhost:7777/api";
const BASEURL_AWS = "http://ec2-13-59-160-226.us-east-2.compute.amazonaws.com/api"

const runTests = async (option) => {
    try {
        testLogin(option, async function (result) {
            let token = result.token;
            await comprehensiveDpTests(option, token);

            await comprehensiveDrTests(option, token);
            console.log("API TEST COMPLETE")
        })
    }
    catch (e) {
        console.error(e);
    }

    // testRegister (option, function (result) {
    //     if (result.TEST_PASSED)
    //         console.log("testRegister PASSED in", result.RESPONSE_TIME);
    //     else
    //         console.log("testRegister FAILED");
    // });

}