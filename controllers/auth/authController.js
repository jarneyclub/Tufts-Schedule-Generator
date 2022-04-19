/*
* Name: authController.js
* API endpoint processing for authentication operations.
*/

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const resHandler = require("../utils/resHandler.js");
const passport = require('passport');
const analyticsHandler = require('../../services/handlers/analytics.js');
const usersHandler = require('../../services/handlers/users.js');
const authHandler = require('../../services/handlers/authentication.js');
const errorHandler = require("../utils/controllerErrorHandler.js").getErrorHandler("authController");
/**
 * Authenticate user credentials, set req.userid and req.password, and 
 * then go to next middleware
 * Preconditions:
 * - req.body.userid is set
 * - req.body.password is set
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */ 
exports.authenticateCredentialsWithPassport = async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            resHandler.respondWithCustomError(req.body.userid, "login", "103", "400", "Login Error", err.message, err.message, true, res);
            return;
        }
        if (!user) {
            console.error("(authenticateCredentialsWithPassport) user: ", user);
            console.error("(authenticateCredentialsWithPassport) info: ", info);
            resHandler.respondWithCustomError(req.body.userid, "login", "103", "400", "Login Error", "Authentication failed", "Authentication failed with info: " + info, true, res);
            return;
        }
        else {
            console.log("(authenticateCredentialsWithPassport) user: ", user);
            // set credentials in request
            req.role = user.role;
            req.firstname = user.first_name;
            req.lastname = user.last_name;
            req.userid = req.body.userid.toLowerCase();
            req.password = req.body.password;
            
            // save activity if user is not developer
            if (req.role !== "developer") {
                analyticsHandler.saveApiUse(req.userid, "Manual Login");
            }
    
            next();
        }
    })(req, res, next);
    // TODO test if just an object with userid and password can be passed to passport.authenticate
}

/**
 * Sign and set JWT to cookie and respond to request with basic user data
 * @param {*} res
 * @param {*} userid
 */
exports.signAccessTokenAndSendAsCookie = async (res, userid) => {
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let result = await dbUsers.findOne({
        userid: userid.toLowerCase()
    });
    console.log("(authController/login) dbUsers.fineOne(..): ", result);
    if (result === null) {
        resHandler.respondWithCustomError(req.body.userid, "Registration", "104", "403", "Registration Error", "Email is not registered. Please register first.", "Email is not registered", true, res);
    }

    let token = jwt.sign({ userid: userid, role: result.role}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    // res.json({"token": token});
    res.cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true
    }).status(200).json({"data": {"first_name": result.first_name, "last_name": result.last_name, "userid": result.userid, "token": token}});
}

/**
 * Signs a token with claims: userid, password, and role. 
 * Sets the token as cookie. Passes control to next middleware.
 * 
 * Preconditions:
 * - req.userid, req.password, req.role, req.firstname, req.lastname are set in previous middleware
 * Postconditions:
 * - access_token is set in cookie
 * @param {*} req
 * @param {*} res
 */
exports.signAccessTokenAndAttachCookie = async (req, res, next) => {
    let token = jwt.sign({ userid: req.userid, role: req.role}, 
        process.env.TOKEN_SECRET, { expiresIn: '24h'});
    res.cookie("access_token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true
    });
    req.token = token;
    next();
}

/**
 * Set token to expire after a second
 * @param {*} res
 */
 exports.setToExpireToken = async (req, res) => {
    let token = jwt.sign({}, process.env.TOKEN_SECRET, { expiresIn: '1s'});

    // save activity if user is not developer
    if (req.role !== "developer") {
        analyticsHandler.saveApiUse(req.userid, "Manual Logout");
    }
    res.cookie("access_token", token, {
        maxAge: 1000,
        httpOnly: true,
        secure: true
    }).status(200).json({});
}


/**
 * Authenticates token from the request. Calls database 
 * to check user identity. Sets req variables:
 * userid, password, role, firstname, lastname. Passes 
 * control to next middleware.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.authenticateToken = async (req, res, next) => {
    // console.log("(authenticateToken) req.body", req.body);
    const token = req.cookies.access_token;
    
    if (token == null) {
        resHandler.respondWithCustomError("UNKNOWN USER", "Token Authentication", "306", "401", 
            "Authentication Error", "Token was not provided", "Token was not provided", true, res);
    }
    else {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, userdata) => {
                // console.log("(authenticateToken) userdata: ", userdata);
                if (err) {
                    let useridFromData = userdata.userid;
                    if (userdata.userid === undefined)
                        useridFromData = "UNKNOWN USER";                    
                    resHandler.respondWithCustomError(useridFromData, "Token Authentication", "305", "401", "Authentication Error", "Token is invalid", "Token is invalid " + err, true, res);
                }
                else {
                    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
                    let result = await dbUsers.findOne({
                        userid: userdata.userid.toLowerCase()
                    });
                    
                    if (result === null) {
                        let useridFromData = userdata.userid;
                        if (userdata.userid === undefined)
                            useridFromData = "UNKNOWN USER";
                        resHandler.respondWithCustomError(useridFromData, "Token Authentication", "307", "401", "Authentication Error", "Token is invalid. Wrong user.", "Token is invalid. Wrong user.", true, res);
                    }
                    else {
                        req.userid = userdata.userid.toLowerCase();
                        req.role = userdata.role;
                        req.firstname = result.first_name;
                        req.lastname = result.last_name;
                        next();
                    }
                }
            });
        } else {
            resHandler.respondWithCustomError("UNKNOWN USER", "Token Authentication", "306", "401", "Authentication Error", "Token was not provided", "Token was not provided", true, res);
        }
    }
}

/**
 * Handle API request validation and response for setting up password reset
 * procedure.
 * Preconditions:
 * - req.body.userid is set
 * @param {*} req
 * @param {*} res
 */
 exports.setupUserPasswordResetAPI = async (req, res) => {
    try {
        const { userid } = req.body;
        if (userid === undefined)
            throw {id: "201", status: "400", title: "Request Error", detail : "userid is undefined", databaseDetail: "req.body.userid is undefined"};
        await authHandler.setupPasswordResetForUser(userid);
        
        res.json({"status": "success"});
        
    } catch (err) {
        errorHandler(err, "setupUserPasswordResetAPI", res, req.body.userid, "user");
    }
};

exports.doUserPasswordResetAPI = async (req, res) => {
    try {
        let { token, password, password_confirmation } = req.body;
        // request body validation
        if (token === undefined)
            throw {id: "201", status: "400", title: "Request Error", detail : "token is undefined", databaseDetail: "req.body.token is undefined"};
        if (password === undefined)
            throw {id: "201", status: "400", title: "Request Error", detail : "password is undefined", databaseDetail: "req.body.password is undefined"};
        if (password_confirmation === undefined)
            throw {id: "201", status: "400", title: "Request Error", detail : "password_confirmation is undefined", databaseDetail: "req.body.password_confirmation is undefined"};
        if (typeof token !== 'string')
            throw {id: "201", status: "400", title: "Request Error", detail : "token is invalid", databaseDetail: "req.body.token is not a string"};
        if (typeof password !== 'string')
            throw {id: "201", status: "400", title: "Request Error", detail : "password is invalid", databaseDetail: "req.body.password is not a string"};
        if (typeof password_confirmation !== 'string')
            throw {id: "201", status: "400", title: "Request Error", detail : "password_confirmation is invalid", databaseDetail: "req.body.password_confirmation is not a string"};
        
        await authHandler.doPasswordResetForUser(token, password, password_confirmation);
        res.json({"status": "success"});
    }
    catch (err) {
        errorHandler(err, "doUserPasswordReset", res, req.userid, req.role);
    }
}