const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.validateRegister = (req, res, next) => {

    console.log("received body: ", req.body);

    // req.sanitizeBody('name');
    // req.checkBody('name', 'You must enter a name!').notEmpty();
    // req.checkBody('email', 'That Email is not valid!').isEmail();

    // // normalizes different email addresses gmail.com, googlemail.com, etc.
    // req.sanitizeBody('email').normalizeEmail({
    //     remove_dots: false,
    //     remove_extension: false,
    //     gmail_remove_subaddress: false
    // });

    // req.checkBody('password', 'Password cannot be blank!').notEmpty();
    // req.checkBody('password-confirm', 'Confirmed password cannot be blank!').notEmpty();
    // req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = validationResult(req);
    let emailsMatch = (req.body.email == req.body.email_confirmation);
    if (!emailsMatch) {

        console.log("Errors detected");

        return res.status(400).json({ error: "Email did not match with confirmation" });
    }

    if (!errors.isEmpty()) {

        // req.flash('error', errors.map(err => err.msg));

        console.log("Errors detected");

        return res.status(400).json({ errors: errors.array() });
    }

    next(); // pass to registration into DB

}

exports.register = async (req, res, next) => {

    console.log("in here");
    
    const user = new User({ email: req.body.email, name: req.body.name });

    User.register(user, req.body.password, (err, user) => {

        // res.send('it works');

        next(); // pass to authController.login()
    });
}

