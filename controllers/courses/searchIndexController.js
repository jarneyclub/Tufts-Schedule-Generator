const mongoose = require('mongoose');
const searchIndex = require('../../services/searchIndex.js');

exports.sendSearchIndex = async (req, res) => {

    var start = Date.now(); // begin timing API endpoint
    
    console.log("(api/courses/alg/serach-table):", "Getting search-table from MongoDB");
    let collectionSearchIndex = mongoose.connection.collection("search-index"); // get MongoDB collection

    let cursor = await collectionSearchIndex.find();
    let responseDatabase = {};
    /* go through each document and append to responseDatabase */
    await cursor.forEach((doc) => {
        let key = doc.query;
        let value = doc.key;

        responseDatabase[key] = value;

    });

    var end = Date.now(); // End timing API endpoint
    var difference = end - start;
    let timeTakenString = difference.toString() + "ms";

    let responseApi = {
        data: responseDatabase,
        time_taken: timeTakenString
    };
    console.log("(api/courses/alg/serach-table):", "search-table successfully retrieved. Sending index...");
    res.json(responseApi);

}

exports.postSearchIndexToDB = async (req, res) => {

    let collectionCourses = mongoose.connection.collection("courses"); // get MongoDB collection

    let cursor = await collectionCourses.find();
    let courseIds = [];
    let courseNames = [];
    /* go through each document and append to response */
    await cursor.forEach((doc) => {
        let course_id = doc.course_id;
        let course_name = doc.course_name;

        courseIds.push(course_id);
        courseNames.push(course_name);
    });

    let collectionSearchIndex = mongoose.connection.collection("search-index"); // get MongoDB collection

    await collectionSearchIndex.drop(async (err, resolve) => {
        if (err) {
            /* collection does not exist */

            // create collection
            mongoose.connection.createCollection("search-index", async (err, sol) => {
                collectionSearchIndex = mongoose.connection.collection("search-index"); // get MongoDB collection

                let response = await searchIndex.generateSearchIndex(courseIds, courseNames, collectionCourses);
                console.log("finished writing index");


                for (let key in response) {
                    let newDoc = {
                        query: key,
                        key: response[key]
                    }

                    collectionSearchIndex.insertOne(newDoc);
                }

                console.log("Search-Table population complete");

            })

        }
        if (resolve) {
            /* collection was deleted */

            // create collection
            mongoose.connection.createCollection("search-index", async (err, sol) => {
                
                collectionSearchIndex = mongoose.connection.collection("search-index"); // get MongoDB collection

                let response = await searchIndex.generateSearchIndex(courseIds, courseNames, collectionCourses);
                console.log("finished writing index");

                for (let key in response) {
                    let newDoc = {
                        query: key,
                        key: response[key]
                    }

                    collectionSearchIndex.insertOne(newDoc);
                }

                console.log("Search-Table population complete");

            })

        }
    });

    res.send("done");
}