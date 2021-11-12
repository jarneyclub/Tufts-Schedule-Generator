const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const resHandler = require("../utils/resHandler.js");
const passport = require('passport');
const activityHandler = require('../../services/handlers/activity.js');

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
            activityHandler.saveErrorActivity(req.body.userid, "login", "400", err.message);
            return resHandler.respondWithCustomError("101", "400", "Login Error", err.message, res);
        }
        if (!user) {
            console.error("(authenticateCredentialsWithPassport) user: ", user);
            console.error("(authenticateCredentialsWithPassport) info: ", info);
            activityHandler.saveErrorActivity(req.body.userid, "login", "400", "Authentication failed with info: " + info);
            return resHandler.respondWithCustomError("101", "400", "Login Error", "Authentication failed", res);
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
                activityHandler.saveNormalActivity(req.userid, "Manual Login");
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
        activityHandler.saveErrorActivity(req.body.userid, "Registration", "403", "Email is not registered");
        resHandler.respondWithCustomError("104", "403", "Registration Error", "Email is not registered. Please register first.", res);
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
    let token = jwt.sign({ userid: req.userid, role: req.role}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
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
        activityHandler.saveNormalActivity(req.userid, "Manual Logout");
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
        activityHandler.saveErrorActivity("UNKNOWN USER", 
            "Token Authentication", "401", "Token was not provided");
        resHandler.respondWithCustomError("306", "401",
            "Authentication Error", "Token was not provided", res);
    }
    else {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, userdata) => {
                // console.log("(authenticateToken) userdata: ", userdata);
                if (err) {
                    activityHandler.saveErrorActivity(userdata.userid, 
                        "Token Authentication", "401", "Token is invalid" + err);
                    resHandler.respondWithCustomError("305", "401", 
                        "Authentication Error", "Token is invalid", res);
                }
                else {
                    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
                    let result = await dbUsers.findOne({
                        userid: userdata.userid.toLowerCase()
                    });
                    
                    if (result === null) {
                        activityHandler.saveErrorActivity(userdata.userid, 
                            "Token Authentication", "401", "Token is invalid.");
                        resHandler.respondWithCustomError("307", "401",
                            "Authentication Error", "Token is invalid. Wrong user.", res);
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
            activityHandler.saveErrorActivity("UNKNOWN USER", 
                "Token Authentication", "401", "Token was not provided.");
            resHandler.respondWithCustomError("306", "401",
                "Authentication Error", "Token was not provided", res);
        }
    }
}
