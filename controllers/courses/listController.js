const mongoose = require('mongoose');

exports.sendListCourseNames = async (req, res) => {

    var start = Date.now(); // begin timing API endpoint

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let cursor = await collectionCourses.find({});
    let responseDatabase = [];
    /* go through each document and append to responseDatabase */
    await cursor.forEach((doc) => {
        let course_name = doc.course_name;
        responseDatabase.push(course_name);
    });

    var end = Date.now(); // End timing API endpoint

    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";

    let responseApi = {
        data: responseDatabase,
        time_taken: timeTakenString
    };

    res.json(responseApi);
}

exports.sendListCourseIDs = async (req, res) => {

    var start = Date.now(); // begin timing API endpoint

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let cursor = await collectionCourses.find();
    let responseDatabase = [];
    /* go through each document and append to responseDatabase */
    await cursor.forEach((doc) => {
        let course_id = doc.course_id;
        responseDatabase.push(course_id);
    });

    var end = Date.now(); // End timing API endpoint
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";

    let responseApi = {
        data: responseDatabase,
        time_taken: timeTakenString
    };


    res.json(responseApi);
}