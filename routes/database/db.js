const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;

require('dotenv').config()

const client = new mongo.MongoClient(process.env.DB_URL, {
    keepAlive: true,
    connectionTimeoutMS: 60000
});

// connect to mongdoDB database and collection
const run = async (cb) => {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to database");

        const database = client.db("courses");

        cb(database);
    }
    catch(e) {
        console.log("MONGODB ERROR: ", e);
    }


}
module.exports.MongoClient = client;
module.exports.run = run;
module.exports.ObjectID = ObjectID;