const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

require('dotenv').config()

const client = new mongo.MongoClient(process.env.DB_URL);

// connect to mongdoDB database and collection
const run = async (cb) => {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to database");

    const database = client.db("courses");
    const collection = database.collection('courses');

    cb(collection);
}

module.exports.run = run;
module.exports.ObjectID = ObjectID;