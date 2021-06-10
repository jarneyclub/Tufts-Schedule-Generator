const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.validateRegister = async (req, res, next) => {

    const {name, email, email_confirmation, password} = req.body;

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
    let emailsMatch = (email === email_confirmation);
    if (!emailsMatch)
        return res.status(400).json({ error: "Email did not match with confirmation" });
    // check if email is already registered
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    let user_exists = (await dbUsers.findOne({"email" : email}) !== null)
    if (user_exists) 
        return res.status(400).json({ error: "Email was already used" });
    // validate result
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    next(); // pass to registration into DB

}

exports.register = async (req, res, next) => {

    console.log("in here");
    
    const user = new User({ email: req.body.email, name: req.body.name });

    User.register(user, req.body.password, (err, user) => {

        next(); // pass to authController.login()
    });
}