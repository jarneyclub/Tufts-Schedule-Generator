const mongoose = require('mongoose');
const User = mongoose.model('User');
// const Guest = mongoose.model('Guest');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.validateRegisterLocal = async (req, res, next) => {

    const {firstname, lastname, userid, password, password_confirmation} = req.body;
    
    // req.sanitizeBody('name');
    // req.checkBody('name', 'You must enter a name!').notEmpty();
    // req.checkBody('email', 'That Email is not valid!').isEmail();

    // // normalizes different email addresses gmail.com, googlemail.com, etc.
    // req.sanitizeBody('email').normalizeEmail({
    //     remove_dots: false,
    //     remove_extension: false,
    //     gmail_remove_subaddress: false
    // });

    // check if email addresses match
    let pwsMatch = (password === password_confirmation);
    if (!pwsMatch)
        return res.status(400).json({ error: "Password did not match with confirmation" });
    // validate result
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    console.log("(userController/validateRegisterLocal) field validation passed");
    next(); // pass to registration into DB

}

exports.registerLocal = async (req, res, next) => {

    
    const user = new User({ userid: req.body.userid, first_name: req.body.firstname, last_name: req.body.lastname, guest: false});
    console.log("(userController/registerLocal) userid: ", req.body.userid)
    console.log("(userController/registerLocal) password: ", req.body.password)
    console.log("(userController/registerLocal) user: ", user)
    // register user with encrypted password
    User.register(user, req.body.password, (err, user) => {
        if (err)
            throw err;
        console.log("(userController/registerLocal) registered user into database");
        console.log("(userController/registerLocal) user: ", user);
        next(); // pass to authController.login()
    });
}

// DRopped feature
exports.registerGuest = async (req, res, next) => {

    // generate random 5 digit integer string
    let randomId = (Math.randomId() * 1000).toString();
    console.log("random guest id: ", randomId);
    // check if this random id already is used
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let result = await dbUsers.findOne({
        userid: randomId
    });
    
    // generate random id until an unused one is found
    while (result !== null) {
        randomId = (Math.randomId() * 1000).toString();
        console.log("random guest id: ", randomId);
        // check if this random id already is used
        result = await dbUsers.findOne({
            userid: randomId
        });
    }
    
    // save guest account to database
    const guest = new Guest({ userid: randomId, name: req.body.name });
    await guest.save();

    req.guestUserId = randomId; // set guest's random id in req for next middleware

    next(); // pass to authController.login()
}