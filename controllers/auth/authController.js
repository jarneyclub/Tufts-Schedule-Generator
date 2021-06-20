const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.login = async (req, res) => {
    const { userid, password } = req.body;
    let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
    console.log("in here")
    let result = await dbUsers.findOne({
        userid: userid
    });
    if (result === null)
        return res.sendStatus(403);
    
    let token = jwt.sign({ userid: userid, password: password}, process.env.TOKEN_SECRET, { expiresIn: '24h'});
    res.json({ token });
};

/* Janith Kasun */
exports.authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, userdata) => {
            console.log("(authenticateToken) userdata: ", userdata);
            if (err) {
                return res.sendStatus(403);
            }
            let dbUsers = mongoose.connection.collection("users"); // get MongoDB collection
            let result = await dbUsers.findOne({
                userid: userdata.userid
            });
            
            if (result === null)
                return res.sendStatus(403);
            
            req.user_id = userdata.userid;
            next();
        });
    } else {
        res.sendStatus(401);
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
