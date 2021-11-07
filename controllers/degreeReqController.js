// load database api
const degreeReqAPI = require('../services/handlers/degreeReq.js');
const activityHandler = require('../services/handlers/activity.js');
const resHandler = require("./utils/resHandler.js");
const mongoose = require('mongoose');

/**
 * Create a public degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.createDegreeReqPublic = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let schema = {
        programName     : req.body.program_name,
        school          : req.body.school,
        degree          : req.body.degree,
        parts           : req.body.parts,
        partIdTracker : req.body.part_id_tracker
    };
    // insert to database
    degreeReqAPI.createDegreeReqPublic(schema)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "createDegreeReqPublic");
        }

        res.status(200);
        res.json({
            pub_dr_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreeReqPublic", res, req.userid, req.role);
    });
}

/**
 * Get all public degree requirements
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreeReqsPublic = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    // get query strings
    let programNameSubstring = req.query.pname;
    // Get list of degree requirements from database
    degreeReqAPI.getDegreeReqsPublic(programNameSubstring)
    .then(documents => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "getDegreeReqsPublic");
        }

        res.status(200);
        res.json({
            reqs: documents,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreeReqPublic", res, req.userid, req.role);
    });
}

/**
 * Delete a public degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.deleteDegreeReqPublic = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get from database
    degreeReqAPI.deleteDegreeReqPublic(req.params.pub_dr_id)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "deleteDegreeReqPublic");
        }

        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreeReqPublic", res, req.userid, req.role);
    });
}

/** 
 * Copy public degree requirement into private
 * @param {any} req 
 * @param {any} res 
 */
exports.copyDegreeReqPublicToPrivate = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let pubDrId = req.params.pub_dr_id;
    let userId  = req.userid;
    // insert to database
    degreeReqAPI.copyDegreeReqPublicToPrivate(pubDrId, userId)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "copyDegreeReqPublicToPrivate");
        }

        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "copyDegreeReqPublicToPrivate", res, req.userid, req.role);
    });
}

exports.createDegreeReqPrivate = async (req, res) => {
    // TODO: if from admin account, create a public degree requirement
    console.log("(degreeReqController/createDegreeReqPrivate) here");
    let start = Date.now(); // begin timing API endpoint
    
    // get user request information
    let schema = {
        programName   : req.body.program_name,
        school        : req.body.school,
        degree        : req.body.degree,
        parts         : req.body.parts,
        partIdTracker : req.body.part_id_tracker
    };
    // get from database
    degreeReqAPI.createDegreeReqPrivate(req.userid, schema)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "createDegreeReqPrivate");
        }

        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreeReqPrivate", res, req.userid, req.role);
    });
}

/**
 * Get all private degree requirements of a user
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreeReqsPrivate = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let query = {
        userId: req.userid
    }
    // get from database
    degreeReqAPI.getDegreeReqsPrivate(query)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "getDegreeReqsPrivate");
        }

        res.status(200);
        res.json({
            reqs: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreeReqsPrivate", res, req.userid, req.role);
    });
}

/**
 * Get a private degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreeReqPrivate = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let query = {
        userId  : req.userid,
        privDrId: req.params.priv_dr_id
    };
    // get from database
    degreeReqAPI.getDegreeReqPrivate(query)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "getDegreeReqsPrivate");
        }

        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreeReqPrivate", res, req.userid, req.role);
    });
}

/**
 * Save/Update a private degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.saveDegreeReqPrivate = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let query = {
        programName     : req.body.program_name ,
        school          : req.body.school,
        degree          : req.body.degree,
        parts           : req.body.parts,
        partIdTracker : req.body.part_id_tracker
    };
    // update in database
    degreeReqAPI.saveDegreeReqPrivate(req.body.priv_dr_id, query)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "saveDegreeReqPrivate");
        }

        res.status(200);
        res.json({
            priv_dr_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "saveDegreeReqPrivate", res, req.userid, req.role);
    });
}

/**
 * Delete a private degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.deleteDegreeReqPrivate = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint

    // get user request information
    let query = {
        privDrId : req.params.priv_dr_id,
        userId   : req.userid
    };
    // delete from database
    degreeReqAPI.deleteDegreeReqPrivate(query)
    .then(result => {
        // save activity if user is not developer
        if (req.role !== "developer") {
            activityHandler.saveNormalActivity(req.userid, "deleteDegreeReqPrivate");
        }

        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreeReqPrivate", res, req.userid, req.role);
    });
}

/** 
 * Copy private degree requirement into public. Only available for developers.
 * Preconditions:
 * - req.role is set in previous middleware
 * @param {any} req 
 * @param {any} res 
 */
 exports.copyDegreeReqPrivateToPublic = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint
    console.log("(drCnrtl/copyDegreeReqPrivateToPublic) req.role: ", req.role);
    if (req.role !== "developer") {
        throw {id: "601", status: "403", title: "Private Degree Requirement Error", detail : "User is not authorized to perform this action"};
    }
    else {
        // get user request information
        let privDrId = req.params.priv_dr_id;
        // insert to database
        degreeReqAPI.copyDegreeReqPrivateToPublic(privDrId)
        .then(result => {
            // save activity if user is not developer
            if (req.role !== "developer") {
                activityHandler.saveNormalActivity(req.userid, "copyDegreeReqPrivateToPublic");
            }

            res.status(200);
            res.json({
                req: result,
                time_taken: ((Date.now() - start).toString() + "ms")
            });
        })
        .catch(err => {
            errorHandler(err, "copyDegreeReqPrivateToPublic", res, req.userid, req.role);
        });
    }
}

const errorHandler = (err, endpoint, res, userid, userrole) => {
    console.error("(degreeReqController/errorhandler) err: ", err + "at endpoint (" + endpoint + ")");
    if (err.detail !== undefined && err.title != undefined) {
        /* this is internally formatted error */

        // save error if user is not developer
        if (userrole !== "developer") {
            let errString = `id: ${err.id} | title: ${err.title} | detail: ${err.detail}`;
            activityHandler.saveErrorActivity(userid, endpoint, err.status, errString);
        }

        resHandler.respondWithCustomError(err.id, err.status, err.title, err.detail, res);
    }
    else {
        console.error("(degreeReqController/" + endpoint, err);
        // save error if user is not developer
        if (userrole !== "developer") {
            let errString = `id: 000 | title: Internal Server Error | detail: ${err}`;
            activityHandler.saveErrorActivity(userid, endpoint, "500", errString);
        }

        resHandler.respondWithCustomError("000", "500", "Internal Server Error", err, res);
    }
}

