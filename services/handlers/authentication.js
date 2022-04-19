const usersHandler = require('../../services/handlers/users.js');
const mongoose = require('mongoose');
const PasswordResetToken = mongoose.model('PasswordResetToken');
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('(authentication.js) CRYPTO SUPPORT IS DISABLED IN THIS BUILD!');
}
////////////////////////////////////////
//                                    //
//         Controller Helpers         //
//                                    //
////////////////////////////////////////
/**
 * @param {string} userid 
 * @returns {string} hash of password reset token
 */
const setupPasswordResetForUser = async (userid) => {
    try {
        // get user information
        let userInfo = await usersHandler.getUserInfoFromDatabase(userid);
        if (userInfo === null) {
            // user not found
            throw {id: "106", status: "400", title: "Password Reset Error", detail : "No user found", databaseDetail : "No user found registered with email: " + userid};
        } else {
            let insertedToken = await createPasswordResetTokenInDb(userid);
            console.log("(setupPasswordResetForUser) userid: " + userid);
            console.log("(setupPasswordResetForUser) insertedToken.hash: " + insertedToken.hash);
            await sendPasswordResetEmailToUser(userid, insertedToken.hash);

            return insertedToken.hash;
        }
    } catch (e) {
        errorHandler(e);
    }
}

/**
 * Reset user password in database. Also delete all password reset tokens
 * associated to the user. TODO Delete all password reset tokens that are expired.
 * @param {string} tokenHash
 * @param {string} password
 * @param {string} password_confirmation
 */
 const doPasswordResetForUser = async (tokenHash, password, password_confirmation) => {
    try {
        let tokenEntry = await getPasswordResetTokenFromDb(tokenHash);
        let dateNow = Date.now();
        // check token is not expired and that given passwords match
        if (tokenEntry.expire <= dateNow) 
            throw {id: "308", status: "400", title: "Password Reset Error", detail : "Token is invalid", databaseDetail: "Password reset token is expired. token expire: " + tokenEntry.expire + ", but right now: " + dateNow };
        if (password !== password_confirmation)
            throw {id: "101", status: "400", title: "Password Reset Error", detail : "Passwords do not match", databaseDetail: "Passwords do not match"};
        let userInfo = await usersHandler.getUserInfoFromDatabase(tokenEntry.userid);
        if (userInfo === null) {
            /* user not found */
            throw {id: "104", status: "400", title: "Password Reset Error", detail : "User not found", databaseDetail: "No user found registered with email" + tokenEntry.userid};
        } else {
            await usersHandler.deleteUserInDb(tokenEntry.userid);
            await registerUser(tokenEntry.userid, password, userInfo.first_name, userInfo.last_name, "user");
            await deletePasswordResetTokenInDb(tokenEntry.userid);
        }
    }
    catch (e) {
        errorHandler(e);    
    }
}

////////////////////////////////////////
//                                    //
//        Database Abstraction        //
//                                    //
////////////////////////////////////////

/**
 * Make a password reset token
 * @param {string} userid 
 * @returns {boolean} true if successful
 */
 const createPasswordResetTokenInDb = async (userid) => {
    try {
        let pwResetHash = createPasswordResetHash(userid);
        let dateNow = Date.now();
        let tokenEntry = {
            hash: pwResetHash,
            userid: userid,
            date: dateNow,
            // token expires in 24h
            expire: dateNow*1000 + 24*60*60*1000  
        }
        let prt = new PasswordResetToken(tokenEntry);
        let insertedPRT = await prt.save();
        console.log("(authentication/createPasswordResetToken) insertedPRT: " + JSON.stringify(insertedPRT));
        return insertedPRT;
    }
    catch (e) {
        console.error("(authentication/createPasswordResetToken) e:", e);
        errorHandler(e);
    }
}

/**
 * Delete all password reset tokens associated to a user
 * @param {string} userid 
 * @returns {boolean} true if successful
 */
const deletePasswordResetTokenInDb = async (userid) => {
    try {
        let prtCollection = mongoose.connection.collection("password_reset_token"); // get MongoDB collection
        await prtCollection.deleteMany({userid: userid});
        return true;
    } catch (e) {
        console.error("(authentication/createPasswordResetToken) e:", e);
        errorHandler(e);
    }
}

/**
 * Delete all expired PRT's in database
 * TODO
 */
const deleteAllExpiredPasswordResetTokenInDb = async () => {
    try {
        let prtCollection = mongoose.connection.collection("password_reset_token"); // get MongoDB collection
        return true;
    } catch (e) {
        console.error("(authentication/deleteAllExpiredPasswordResetTokenInDb) e:", e);
        errorHandler(e);
    }
}

/**
 * Make a password reset token
 * @param {string} userid
 * @returns 
 */
const getPasswordResetTokenFromDb = async (tokenHash) => {
    try {
        let prt = await PasswordResetToken.findOne({ hash: tokenHash });
        if (prt === null) {
            throw { id: "202", status: "404", title: "Password Reset Token Error", detail: "Token not found", databaseDetail: "No token found with hash: " + tokenHash };
        }
        else {
            console.log("(authentication/getPasswordResetTokenFromDb) prt: " + JSON.stringify(prt));
            return {
                userid: prt.userid,
                date: prt.date,
                expire: prt.expire
            };
        }
    }
    catch (e) {
        errorHandler(e);
    }
}

const registerUser = async (userid, password, first_name, last_name, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (role !== "user" && role !== "developer")
                reject({ id: "107", status: "409", title: "User Registration Error", detail: "User has invalid role", databaseDetail: "User has invalid role. Must be either 'user' or 'developer'. Got " + role });
            const User = mongoose.model('User');
            const user = new User ({ userid: userid, first_name: first_name, last_name: last_name, role: "user" });
            // register user with encrypted password
            await User.register(user, password, (err, user) => {
                if (err) {
                    if (err.message.indexOf("already registered") > -1)
                        reject({ id: "102", status: "409", title: "User Registration Error", detail: "The email is already in use", databaseDetail: "The email is already in use" });
                    else
                        reject({id: "105", status: "409", title: "User Registration Error", detail: "Something is wrong. Registration failed.", databaseDetail: "Something is wrong. Registration failed"});
                } else {
                    console.log("(authentication/registerUser) registered user into database");
                    console.log("(authentication/registerUser) user: ", user);
                    resolve();
                }
            });
        } catch (e) {
            errorHandler(e);
        }
    });
}

////////////////////////////////////////
//                                    //
//               MISC                 //
//                                    //
////////////////////////////////////////

/**
 * Make a string generated from cryptographically strong pseudorandom values
 * @param {number} length Must be even
 * @returns {string} Random string of given length
 */
const makeSecureRandomString = (length) => {
    if (length % 2 !== 0) {
        throw new Error("Length must be even");
    }
    return crypto.randomBytes(length/2).toString("hex");
}

/**
 * Create a password reset hash that is made from userid, current data, 
 * and a random string.
 * @param {string} userid
 * @returns {string} hash
 */
const createPasswordResetHash = (userid) => {
    const hash = crypto.createHash('sha256');
    let dateNow = Date.now();
    let hashInput = userid + dateNow*1000 + makeSecureRandomString(6);
    hash.update(hashInput);
    return hash.copy().digest('hex')
}

/**
 * Send a password reset email to user.
 * Preconditions:
 * - req.body.userid is set
 * @param {string} userid
 * @param {string} pwResetHash
 */
 const sendPasswordResetEmailToUser = async (userid, pwResetHash) => {
    const emailUtils = require('../emailUtils.js');

    if (userid === undefined)
        throw {id: "602", status: "400", title: "Authentication Error", detail : "Parameter(s) is invalid", databaseDetail : "Userid is not defined"};
    if (typeof userid !== 'string')
        throw {id: "602", status: "400", title: "Authentication Error", detail : "Parameter(s) is invalid", databaseDetail : "Userid is not a string"};

    if (pwResetHash === undefined) {
        throw {id: "602", status: "400", title: "Authentication Error", detail : "Parameter(s) is invalid", databaseDetail : "pwResetHash is not defined"};
    }
    if (typeof pwResetHash !== 'string')
        throw {id: "602", status: "400", title: "Authentication Error", detail : "Parameter(s) is invalid", databaseDetail : "pwResetHash is not a string"};
    
    await emailUtils.sendEmail(userid, "Reset the password for your JARney account!", "Password reset link: " + process.env.SITE_URL + "/passwordreset/" + pwResetHash);
}


const errorHandler = (e) => {
    console.log("(authentication errorHandler) e: ", e);
    if (e.message !== undefined) {
        if (e.message.indexOf("was not found") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Authentication Error", detail: "Something went wrong", databaseDetail: e.message };
        }
        else if (e.message.indexOf("validation failed") > -1) {
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Authentication Error", detail: "Something went wrong", databaseDetail: e.message };
        }
        else {
            throw { id: "000", status: "500", title: "Authentication Error", detail: "Something went wrong", databaseDetail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail, databaseDetail: e.databaseDetail };
        }
    }
}
exports.setupPasswordResetForUser = setupPasswordResetForUser;
exports.createPasswordResetTokenInDb = createPasswordResetTokenInDb;
exports.deletePasswordResetTokenInDb = deletePasswordResetTokenInDb;
exports.getPasswordResetTokenFromDb = getPasswordResetTokenFromDb;
exports.doPasswordResetForUser = doPasswordResetForUser;
exports.registerUser = registerUser;