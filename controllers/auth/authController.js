const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const resHandler = require("../utils/resHandler.js");
const passport = require('passport');

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
        if (err)
            return resHandler.respondWithCustomError("101", "400", "Login Error", err.message, res);
        if (!user) {
            console.error("(authenticateCredentialsWithPassport) user: ", user);
            console.error("(authenticateCredentialsWithPassport) info: ", info);
            return resHandler.respondWithCustomError("101", "400", "Login Error", "Authentication failed", res);
        }
        else {
            // set credentials in request
            req.userid = req.body.userid;
            req.password = req.body.password;
            next();
        }
    })(req, res, next);
    // TODO test if just an object with userid and password can be passed to passport.authenticate
}

/**
 * Sign and set JWT to cookie and respond to request with basic user data
 * @param {*} res
 * @param {*} userid
 * @param {*} password
 */
exports.signAccessTokenAndSendAsCookie = async (res, userid, password) => {
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let result = await dbUsers.findOne({
        userid: userid
    });
    console.log("(authController/login) dbUsers.fineOne(..): ", result);
    if (result === null)
        resHandler.respondWithCustomError("104", "403", "Registration Error", "Email is not registered. Please register first.", res);
        
    let token = jwt.sign({ userid: userid, password: password}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    // res.json({"token": token});
    res.cookie("access_token", token, {
    }).status(200).json({"data": {"first_name": result.first_name, "last_name": result.last_name, "userid": result.userid}});
}

/**
 * Attaches access token in the cookie of the response
 * 
 * Preconditions:
 * - req.userid and req.password is set in previous middleware
 * @param {*} req
 * @param {*} res
 */
exports.signAccessTokenAndAttachCookie = async (req, res, next) => {
    let token = jwt.sign({ userid: req.userid, password: req.password}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    res.cookie("access_token", token, {
        // httpOnly: true
    });
    next();
}

/* Janith Kasun */
exports.authenticateToken = async (req, res, next) => {
    console.log("req.cookies", req.cookies);
    const token = req.cookies.access_token;
    
    if (token == null)
        resHandler.respondWithCustomError("306", "401",
            "Authentication Error", "Token was not provided", res);

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, userdata) => {
            console.log("(authenticateToken) userdata: ", userdata);
            if (err)
                resHandler.respondWithCustomError("305", "401", "Authentication Error", "Token is invalid", res);
            let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
            let result = await dbUsers.findOne({
                userid: userdata.userid
            });
            
            if (result === null)
                resHandler.respondWithCustomError("307", "401",
                        "Authentication Error", "Token is invalid. Wrong user.", res);
            
            req.userid = userdata.userid;
            req.password = userdata.password;
            next();
        });
    } else {
        resHandler.respondWithCustomError("306", "401",
            "Authentication Error", "Token was not provided", res);
    }
}
