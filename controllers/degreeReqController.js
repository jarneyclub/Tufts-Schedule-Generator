// load database api
const degreeReqAPI = require('../services/handlers/degreeReq.js');
const resHandler = require("./utils/resHandler.js");
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
        res.status(200);
        res.json({
            pub_dr_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreeReqPublic", res);
    });
}

/**
 * Get all public degree requirements
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreeReqsPublic = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint
    
    // get from database
    degreeReqAPI.getDegreeReqsPublic()
    .then(result => {
        res.status(200);
        res.json({
            reqs: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreeReqsPublic", res);
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
        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreeReqPublic", res);
        // errorHandler(res, err, start);
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
    let userId  = req.user_id;
    // insert to database
    degreeReqAPI.copyDegreeReqPublicToPrivate(pubDrId, userId)
    .then(result => {
        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "copyDegreeReqPublicToPrivate", res);
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
    degreeReqAPI.createDegreeReqPrivate(req.user_id, schema)
    .then(result => {
        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreeReqPrivate", res);
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
        userId: req.user_id
    }
    // get from database
    degreeReqAPI.getDegreeReqsPrivate(query)
    .then(result => {
        res.status(200);
        res.json({
            reqs: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreeReqsPrivate", res);
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
        userId  : req.user_id,
        privDrId: req.params.priv_dr_id
    };
    // get from database
    degreeReqAPI.getDegreeReqPrivate(query)
    .then(result => {
        res.status(200);
        res.json({
            req: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreeReqPrivate", res);
    });
}

/**
 * Save/Update a private degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.saveDegreeReqPrivate = async (req, res) => {
    // TODO: if from admin account, save the public degree requirement
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
        res.status(200);
        res.json({
            priv_dr_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "saveDegreeReqPrivate", res);
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
        userId   : req.user_id
    };
    // delete from database
    degreeReqAPI.deleteDegreeReqPrivate(query)
    .then(result => {
        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreeReqPrivate", res);
    });
}

