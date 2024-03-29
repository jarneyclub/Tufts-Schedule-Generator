/*
* Name: userController.js
* API endpoints implementation for user operations.
* 
* 
*/

const mongoose = require('mongoose');
const User = mongoose.model('User');
// const Guest = mongoose.model('Guest');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const resHandler = require("../utils/resHandler.js");
const authController = require("./authController.js");
const analyticsHandler = require('../../services/handlers/analytics.js');


/**
 * POST api/auth/login
 * Log the user in with given email and password
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
    const { userid, password } = req.body;
    // check user credentials and respond
    await authController.signAccessTokenAndSendAsCookie(res, userid);
};

/**
 * POST api/auth/login
 * Send the response to the login endpoint
 * Preconditions:
 * - req.userid, req.firstname, req.lastname, is set in previous middleware
 * - req.userid (email) exists in database
 * @param {*} req
 * @param {*} res
 */
exports.sendLoginResponse = async (req, res) => {
    console.log("(usrCntrl/sendLoginResponse) req.userid: ", req.userid);
    
    res.json({"data": {"first_name": req.firstname, "last_name": req.lastname, "userid": req.userid}});
};

/**
 * Validate user input before registering user
 * Preconditions:
 * - Password fields are not empty
 * - userid (email) is a normalized email address
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.validateRegisterLocal = async (req, res, next) => {
    const {first_name, last_name, userid, password, password_confirmation} = req.body;
    // check if email addresses match
    let pwsMatch = (password === password_confirmation);
    if (!pwsMatch)
        resHandler.respondWithCustomError("UNKNOWN USER", "validate user input", "101", "400", "Registration Error", "Password did not match with confirmation", "Password did not match with confirmation", false, res);
    else {
        // validate result
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        else {
            console.log("(userController/validateRegisterLocal) field validation passed");

            // save activity if user is not developer
            if (req.role !== "developer") {
                analyticsHandler.saveApiUse(req.userid, "Manual Register");
            }

            next(); // pass to registration into DB
        }
    }
}

exports.registerLocal = async (req, res, next) => {

    const user = new User ({ userid: req.body.userid, first_name: req.body.first_name, last_name: req.body.last_name, role: "user" });
    console.log("(userController/registerLocal) userid: ", req.body.userid)
    console.log("(userController/registerLocal) password: ", req.body.password)
    console.log("(userController/registerLocal) user: ", user)
    // register user with encrypted password
    User.register(user, req.body.password, (err, user) => {
        if (err) {
            if (err.message.indexOf("already registered") > -1)
                resHandler.respondWithCustomError(req.body.userid, "register", "102", "409", "Registration Error", "The email is already in use",  "The email is already in use", false, res);
            else {
                if (err.message !== undefined)
                    resHandler.respondWithCustomError(req.body.userid, "register", "105", "409", "Registration Error", "Something is wrong. Registration Failed.", "error.message=" + err.message, false, res);
                else 
                    resHandler.respondWithCustomError(req.body.userid, "register", "105", "409", "Registration Error", "Something is wrong. Registration Failed.", "Something is wrong. And err.message is undefined...", false, res);
            }
        } else {
            console.log("(userController/registerLocal) registered user into database");
            console.log("(userController/registerLocal) user: ", user);
            next(); // pass to authController.login()
        }

    });
}

