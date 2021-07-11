const BASEURL_PRODUCTION = "http://ec2-3-87-205-234.compute-1.amazonaws.com:3000/api";
const BASEURL_DEVELOPMENT = "http://localhost:7777/api";
// const BASEURL_AWS = "http://ec2-3-87-205-234.compute-1.amazonaws.com/api"

const runTests = async (option) => {
    try {
        testLogin(option, async function (result) {
            let token = result.token;
            await comprehensiveDpTests(option, token);

            await comprehensiveDrTests(option, token);
            console.log("API TEST COMPLETE")
        })

        // let res = await testGetCoursesByCnum(option, "CS-0011");
        // console.log("(CS-0011) res: ", res)
        // res = await testGetCoursesByCnum(option, "CS");
        // console.log("(CS) res: ", res)
        // res = await testGetCoursesByCnum(option, "C");
        // console.log("(C) res: ", res)
        // res = await testGetCoursesTerm(option, "CS", "SOE-Computing");
        // console.log("TERM (CS, SOE-Computing) res: ", res)
        // res = await testGetCoursesTerm(option, "", "SOE-Computing");
        // console.log("TERM (, SOE-Computing) res: ", res)
        // res = await testGetCoursesTerm(option, "CS", "");
        // console.log("TERM (CS,) res: ", res)
        // testRegister (option, function (result) {
        //     if (result.TEST_PASSED)
        //         console.log("testRegister PASSED in", result.RESPONSE_TIME);
        //     else
        //         console.log("testRegister FAILED");
        // });
    }
    catch (e) {
        console.error(e);
    }
}