const passport = require('passport');

exports.login = async (req, res) => {
    passport.authenticate('local', () => {
        console.log("here")
        res.send("Login successful");
    });
};