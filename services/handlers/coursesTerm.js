const mongoose = require('mongoose');
const sectionsCol = mongoose.model('Section');

/**
 * Gets all sections associated with a course. Changes 
 * @param {*} termCourseIdInput
 * @return {array} 
 */
exports.getSectionsForSingleCourse = async (termCourseIdInput) => {
    try {
        // term_course_id is a string
        let cursor = await sectionsCol.find({term_course_id: termCourseIdInput});
        let documents = [];
        await cursor.forEach(async (doc) => {
            doc["_id"] = doc["_id"].valueOf();
            documents.push(doc);
        });
        return documents;
    }
    catch(e) {
        errorHandler(e);
    }
}

exports.getSectionsForMultipleCourses = async (arrayTermCourseId) => {
    try {
        let courseToSections = {};
        for (let termCourseId of arrayTermCourseId) {
            let cursor = await sectionsCol.find({term_course_id: {$in: arrayTermCourseId}});
            let documents = [];
            await cursor.forEach(async (doc) => {
                doc["_id"] = doc["_id"].valueOf();
                documents.push(doc);
            });
        }
        return documents;
    }
    catch(e) {

    }
}

const errorHandler = (e) => {
    console.log("(coursesTerm errorHandler)");
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Course Term Error", detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Course Term Error", detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Course Term Error", detail: e.message };
        }
        else {
            console.error(e.message);
            throw { id: "000", status: "500", title: "Course Term Error", detail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
        else {
            throw { id: "000", status: "500", title: "Course Term Error", detail: e.message };
        }
    }
}