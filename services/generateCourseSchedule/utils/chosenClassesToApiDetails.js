const timeUtils = require("./timeUtils.js");

const chosenClassesToApiDetails = (global) => {
    let chosenClasses = global.resultClasses;

    // console.log("chosenClasses: ", chosenClasses);

    let size = Object.keys(chosenClasses).length;
    console.log("(chosenClassesToApiDet):", "number of schedules: ", size);
    let randomIndex = Math.ceil(Math.random() * (size - 1));
    console.log("(chosenClassesToApiDet):", "chosenIndex: ", randomIndex);

    let classes = chosenClasses[randomIndex];

    let result = {
        "Monday": [],
        "Tuesday": [],
        "Wednesday": [],
        "Thursday": [],
        "Friday": [],
        "Saturday": [],
        "Sunday": [],
        "TimeUnspecified": []
    }

    for (let i in classes) {
        let singleClass = classes[i];

        let day = singleClass.getDayOfWeek();

        /* parse class information */
        let time_start = singleClass.getStartTime();
        let time_end = singleClass.getEndTime();

        // Convert integer times to military time
        let time_start_military = timeUtils.integerToMilitaryTime(time_start);
        let time_end_military = timeUtils.integerToMilitaryTime(time_end);

        let sectionName = singleClass.getSectionName();
        let sectionId = singleClass.getSectionID();
        let courseId = singleClass.getCourseID();
        let courseDatabaseId = singleClass.getCourseDatabaseId();
        let courseName = singleClass.getCourseName();
        let room = singleClass.getLocation();
        let city = singleClass.getCity();
        let instructors = singleClass.getInstructors();
        console.log("(chosenClassesToApiDet):", "sectionId: ", sectionId);
        console.log("(chosenClassesToApiDet):", "instructors: ", instructors);
        let location = room + "," + city;
        let eventName = sectionName;
        let eventDetails = courseName + ", " + courseId;

        let eventObject = {
            name: eventName,
            details: eventDetails,
            location: location,
            instructors: instructors,
            term_section_id: sectionId,
            term_course_id: courseDatabaseId,
            time_start: time_start_military,
            time_end: time_end_military
        }
        console.log("courseId: ", courseId);
        console.log("courseName: ", courseName);
        console.log("day: ", day);

        switch (day) {
            case -1:
                result["TimeUnspecified"].push(eventObject);
                break;
            case 1:
                result["Monday"].push(eventObject);
                break;
            case 2:
                result["Tuesday"].push(eventObject);
                break;
            case 3:
                result["Wednesday"].push(eventObject);
                break;
            case 4:
                result["Thursday"].push(eventObject);
                break;
            case 5:
                result["Friday"].push(eventObject);
                break;
            case 6:
                result["Saturday"].push(eventObject);
                break;
            case 7:
                result["Sunday"].push(eventObject);
                break;
        }
    }

    return result;

}

module.exports = chosenClassesToApiDetails;