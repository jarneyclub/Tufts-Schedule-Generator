const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const resHandler = require("../utils/resHandler.js");
const passport = require('passport');

exports.authenticateLocal = async (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err)
            return resHandler.respondWithCustomError("101", "400", "Login Error", err.message, res);
        if (!user) 
            return resHandler.respondWithCustomError("101", "400", "Login Error", "Authentication failed", res);
        else 
            next();
    })(req, res, next);
}

exports.login = async (req, res) => {
    const { userid, password } = req.body;
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let result = await dbUsers.findOne({
        userid: userid
    });
    console.log("(authController/login) dbUsers.fineOne(..): ", result);
    if (result === null)
        resHandler.respondWithCustomError("104", "403", "Registration Error", "Email is not registered. Please register first.", res);
    
    let token = jwt.sign({ userid: userid, password: password}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    res.json({"token": token});
    // res.cookie("access_token", token, {
    // }).status(200).json({"data": {"first_name": result.first_name, "last_name": result.last_name, "userid": result.userid}});
};

/**
 *
 * 
 * @param {*} req
 * @param {*} res
 */
exports.SignTokenAndAddToCookie = async (req, res, next) => {
    let token = jwt.sign({ userid: req.userid, password: req.password}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    res.cookie("access_token", token, {
        // httpOnly: true
    });
    next();
}

/* Janith Kasun */
exports.authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    
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
            
            req.user_id = userdata.userid;
            next();
        });
    } else {
        resHandler.respondWithCustomError("306", "401",
            "Authentication Error", "Token was not provided", res);
    }
}

// DRopped feature
// before "registering" a guest, check if guest is already "registered"
exports.checkGuestToken = async (req, res ,next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
            let result = await dbUsers.findOne({
                userid: user
            });

            if (result === null) {
                /* guest's authroization header is incorrect */
                return res.sendStatus(403);
            }
            if (result.guest === false) {
                /* guest's authorization is for a registered user */
            }
            
            /* a valid guest token was already provided */
            res.json({ token }); // send token back for future use
        });
    } else {
        next();
    }
}

// Dropped feature
exports.loginGuest = async (req, res) => {
    let userid = req.guestUserId;

    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let result = await dbUsers.findOne({
        userid: userid
    });

    if (result === null)
        return res.sendStatus(403);

    let token = jwt.sign(userid, process.env.TOKEN_SECRET);

    res.json({ token });
}
