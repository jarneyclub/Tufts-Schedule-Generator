const mongoose = require('mongoose');

exports.sendSingleDocumentByOID = async (req, res) => {

    let objectId = req.params.id;

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let oid = mongoose.Types.ObjectId(objectId);
    let document = await collectionCourses.findOne({ '_id': oid });

    let response = {
        data: document
    };

    res.json(response);

}

exports.sendMultipleDocumentsByOIDs = async (req, res) => {

    let objectIds = req.query.id;
    console.log("objectIds: ", objectIds);

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let documents = []

    for (let index in objectIds) {
        let objectId = objectIds[index];

        console.log("objectId: ", objectId);

        let oid = mongoose.Types.ObjectId(objectId);
        let document = await collectionCourses.findOne({ '_id': oid });

        documents.push(document);
    }

    let response = {
        data: {
            documents: documents
        }
    };

    res.json(response);
}

exports.sendDocumentsByCourseID = async (req, res) => {

    let query = req.params.id;

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let cursor = await collectionCourses.find({ 'course_id': query });

    let documents = [];
    /* go through each document and append to documents */
    await cursor.forEach((doc) => {
        documents.push(doc);
    });

    console.log("documents: ", documents);

    let response = {
        data: {
            documents: documents
        }
    }

    res.json(response)
}

exports.sendDocumentsByCourseName = async (req, res) => {

    let query = req.params.name;

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let cursor = await collectionCourses.find({ 'course_name': query });
    let documents = [];
    /* go through each document and append to documents */
    await cursor.forEach((doc) => {
        documents.push(doc);
    });

    console.log("documents: ", documents);

    let response = {
        data: {
            documents: documents
        }
    }

    res.json(response);
}