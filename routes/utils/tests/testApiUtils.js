const ApiUtils = require('../apiUtils.js');
const testDocument = require('./testDocument.js');

const testDocumentToCourse = () => {
    console.log("########### TEST (documentToCourse) ##################")
    let course = ApiUtils.documentToCourse(testDocument.testDocument);
    
    if (course.getCourseName() != "Data Structures")
        console.log("Course.getCourseName(): failed. Got: ", course.getCourseName());
    
    if (course.getCourseID() != "COMP-0015")
        console.log("Course.getCourseID(): failed. Got: ", course.getCourseID());
    
    let sections = course.getSections();

    if (Object.keys(sections).length != 2)
        console.log("Size of sections is 2: failed. Got: ", Object.keys(sections));

    let lectures = sections.Lecture;
    let firstLecture = lectures[0];
    
    if (firstLecture.getCourseID() != "COMP-0015")
        console.log("Section.getCourseID(): failed. Got: ", firstLecture.getCourseID());

    if (firstLecture.getCourseName() != "Data Structures")
        console.log("Section.getCourseName(): failed. Got: ", firstLecture.getCourseName());
    
    if (firstLecture.getSectionName() != "01-LEC")
        console.log("Section.getSectionName(): failed. Got: ", firstLecture.getSectionName());
    
    if (firstLecture.getSectionType() != "Lecture")
        console.log("Section.getSectionType(): failed. Got: ", firstLecture.getSectionType())

    let firstLectureClasses = firstLecture.getClasses();
    if (firstLectureClasses.length != 2)
        console.log("Size of firstLectureClasses is 2: failed. Got: ", firstLectureClasses.length);

    let firstLectureFirstClass = firstLectureClasses[0];
    // console.log("firstLectureClasses:" , firstLectureClasses);
    if (firstLectureFirstClass.getCourseID() != "COMP-0015")
        console.log("Class.getCourseID(): failed. Got: ", firstLectureFirstClass.getCourseID());

    if (firstLectureFirstClass.getCourseName() != "Data Structures")
        console.log("Class.getCourseName(): failed. Got: ", firstLectureFirstClass.getCourseName());

    if (firstLectureFirstClass.getSectionName() != "01-LEC")
        console.log("Class.getSectionName(): failed. Got: ", firstLectureFirstClass.getSectionName());

    if (firstLectureFirstClass.getSectionType() != "Lecture")
        console.log("Class.getSectionType(): failed. Got: ", firstLectureFirstClass.getSectionType())
    
    if (firstLectureFirstClass.getInstructors()[0] == " Mark A Sheldon")
        console.log("Class.getInstructors()[0]: failed. Got: ", firstLectureFirstClass.getInstructors()[0])
    
    if (firstLectureFirstClass.getDayOfWeek() != 1)
        console.log("Class.getDayOfWeek(): failed. Got: ", firstLectureFirstClass.getDayOfWeek())
    
    if (firstLectureFirstClass.getStartTime() != 900)
        console.log("Class.getStartTime(): failed. Got: ", firstLectureFirstClass.getStartTime())
    
    if (firstLectureFirstClass.getEndTime() != 975)
        console.log("Class.getEndTime(): failed. Got: ", firstLectureFirstClass.getEndTime())
    
    let firstLectureSecondClass = firstLectureClasses[1];
    // console.log("firstLectureClasses:" , firstLectureClasses);
    if (firstLectureSecondClass.getCourseID() != "COMP-0015")
        console.log("firstLectureSecondClass.getCourseID(): failed. Got: ", firstLectureSecondClass.getCourseID());

    if (firstLectureSecondClass.getCourseName() != "Data Structures")
        console.log("firstLectureSecondClass.getCourseName(): failed. Got: ", firstLectureSecondClass.getCourseName());

    if (firstLectureSecondClass.getSectionName() != "01-LEC")
        console.log("firstLectureSecondClass.getSectionName(): failed. Got: ", firstLectureSecondClass.getSectionName());

    if (firstLectureSecondClass.getSectionType() != "Lecture")
        console.log("firstLectureSecondClass.getSectionType(): failed. Got: ", firstLectureSecondClass.getSectionType())

    if (firstLectureSecondClass.getInstructors()[0] == " Mark A Sheldon")
        console.log("firstLectureSecondClass.getInstructors()[0]: failed. Got: ", firstLectureSecondClass.getInstructors()[0])

    if (firstLectureSecondClass.getDayOfWeek() != 3)
        console.log("firstLectureSecondClass.getDayOfWeek(): failed. Got: ", firstLectureSecondClass.getDayOfWeek())

    if (firstLectureSecondClass.getStartTime() != 900)
        console.log("firstLectureSecondClass.getStartTime(): failed. Got: ", firstLectureSecondClass.getStartTime())

    if (firstLectureSecondClass.getEndTime() != 975)
        console.log("firstLectureSecondClass.getEndTime(): failed. Got: ", firstLectureSecondClass.getEndTime())
    
    let secondLecture = lectures[1];
    if (secondLecture.getCourseID() != "COMP-0015")
        console.log("Section.getCourseID(): failed. Got: ", secondLecture.getCourseID());

    if (secondLecture.getCourseName() != "Data Structures")
        console.log("Section.getCourseName(): failed. Got: ", secondLecture.getCourseName());

    if (secondLecture.getSectionName() != "02-LEC")
        console.log("Section.getSectionName(): failed. Got: ", secondLecture.getSectionName());

    if (secondLecture.getSectionType() != "Lecture")
        console.log("Section.getSectionType(): failed. Got: ", secondLecture.getSectionType())

    let secondLectureClasses = secondLecture.getClasses();
    let secondLectureFirstClass = secondLectureClasses[0];
    if (secondLectureFirstClass.getCourseID() != "COMP-0015")
        console.log("secondLectureFirstClass.getCourseID(): failed. Got: ", secondLectureFirstClass.getCourseID());

    if (secondLectureFirstClass.getCourseName() != "Data Structures")
        console.log("secondLectureFirstClass.getCourseName(): failed. Got: ", secondLectureFirstClass.getCourseName());

    if (secondLectureFirstClass.getSectionName() != "02-LEC")
        console.log("secondLectureFirstClass.getSectionName(): failed. Got: ", secondLectureFirstClass.getSectionName());

    if (secondLectureFirstClass.getSectionType() != "Lecture")
        console.log("secondLectureFirstClass.getSectionType(): failed. Got: ", secondLectureFirstClass.getSectionType())

    if (secondLectureFirstClass.getInstructors()[0] == " Mark A Sheldon")
        console.log("secondLectureFirstClass.getInstructors()[0]: failed. Got: ", secondLectureFirstClass.getInstructors()[0])

    if (secondLectureFirstClass.getDayOfWeek() != 1)
        console.log("secondLectureFirstClass.getDayOfWeek(): failed. Got: ", secondLectureFirstClass.getDayOfWeek())

    if (secondLectureFirstClass.getStartTime() != 900)
        console.log("secondLectureFirstClass.getStartTime(): failed. Got: ", secondLectureFirstClass.getStartTime())

    if (secondLectureFirstClass.getEndTime() != 1065)
        console.log("secondLectureFirstClass.getEndTime(): failed. Got: ", secondLectureFirstClass.getEndTime())

    console.log("########### END TEST (documentToCourse) ##################")
}

testDocumentToCourse();