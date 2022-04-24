/*
* Name: users.js
* Functions for getting/putting database information about users
*/

const mongoose = require('mongoose');
const userModel = mongoose.model('User');

/**
 * Tell whether or not a user exists
 * @param {string} userid
 * @returns null or the user object
 */
exports.getUserInfoFromDatabase = async (userid) => {
    try {
        if (userid === undefined)
            throw { id: "???", status: "400", title: "Users Error", detail: "userid is undefined", databaseDetail: "userid is undefined"};
        // get users collection
        let dbUsers = mongoose.connection.collection("users");
        let doc = await dbUsers.findOne({
            userid: userid.toLowerCase()
        });

        if (doc === null)
            return null;
        else
            return {
                _id        : doc._id.valueOf(),
                role       : doc.role,
                userid     : doc.userid,
                first_name : doc.first_name,
                last_name  : doc.last_name
            };
        
    }
    catch (e) {
        console.error("(getUserInfoFromDatabase) e: ", e);
        errorHandler(e);
    }
}

/**
 * Delete user from database
 * @param {string} userid
 * @returns true
 */
exports.deleteUserInDb = async (userid) => {
    try {
        // get users collection
        let usersCollection = mongoose.connection.collection("users");
        await usersCollection.deleteOne({ userid: userid });
        return true;
    } catch (e) {
        console.error("(deleteUserInDb) e: ", e);
        errorHandler(e);
    }
}


const errorHandler = (e) => {
    console.log("(users errorHandler)");
    if (e.message !== undefined) {
        if (e.message.indexOf("was not found") > -1) {
            /* error is mongoose validation error */
            throw { id: "106", status: "400", title: "Users Error", detail: e.message};
        }
        else if (e.message.indexOf("validation failed") > -1) {
            /* error is mongoose validation error */
            // throw { code: 1, message: e.message };
            throw { id: "201", status: "400", title: "Users Error", detail: e.message};
        }
        else {
            throw { id: "000", status: "500", title: "Users Error", detail: e.message};
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
    }
}