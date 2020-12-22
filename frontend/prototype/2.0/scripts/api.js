/* Must be included after jquery */

var REACT_APP_API_URL = "https://tuftsschedulerapi.herokuapp.com";

/* get information of single course */
async function getCourseInfo(courseName) {
    var response;
    
    await $.ajax({
        url: REACT_APP_API_URL + "/course" + "/?course=" + courseName,
        "method": "GET"
    }).done(function (data) {
        console.log("received data: ", data);
        response = data;
    })

    return response;
}

/* get information of multiple courses */
async function getCoursesInfo(listCourses) {
    var coursesInfoGathered = [];

    for (var index in listCourses) {
        var courseInfo = await getCourseInfo(listCourses[index]);
        coursesInfoGathered.push(courseInfo);
    }

    return coursesInfoGathered;
}

async function getAllTimesNecessary(objectSectionTypes) {
    var allTimes = [];
    console.log(objectSectionTypes)
    for (var key in objectSectionTypes) {
        
        if (key != "section_types") {
            var sectionType = objectSectionTypes[key];
            var settings = sectionType[0].settings;
            try {
                var firstSetting = settings[0];
            }
            catch(e) {
                console.log(key);
            }

            var time = firstSetting.times[0];
            console.log("time: ", time);

            var days = time[0];
            var interval = time[1];
            for (var j in days) {
                var timeElement = [];
                timeElement.push(days[j])
                timeElement.push(interval[0]);
                timeElement.push(interval[1]);

                allTimes.push(timeElement);
            }
        }

    }    return allTimes;
}