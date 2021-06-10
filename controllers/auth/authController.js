const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    let token = jwt.sign(email, process.env.TOKEN_SECRET);
    res.json({ token });
};

/* Janith Kasun */
exports.authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
            let result = await dbUsers.findOne({
                email: user
            });
            
            if (result === null)
                return res.sendStatus(403);
            
            req.user_id = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}