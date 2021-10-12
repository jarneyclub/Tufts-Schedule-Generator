// load database api
const degreePlanAPI = require('../services/handlers/degreePlan.js');
const resHandler = require("./utils/resHandler.js");
// const errorHandler = require('../services/handlers/errorHandler');
/**
 * Create a new degree plan
 * @param {any} req 
 * @param {any} res 
 */
exports.createDegreePlan = async (req, res) => {
    let start = Date.now(); // begin timing API endpoint
    
    // get user request information
    let query = {
        plan_name: req.body.plan_name,
        user_id: req.userid
    }
    // insert to database
    degreePlanAPI.createNewDegreePlan(query)
    .then(result => {
        res.status(200);
        res.json({
            plan: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreePlan", res);
    });
}

/**
 * Get a degree plan
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreePlan = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    console.log("(controllers/getDegreePlan) ", "req.query: ", req.query);
    // get user request information
    let query = {
        user_id: req.userid,
        plan_id: req.query.plan_id
    };
    
    // get from database
    degreePlanAPI.getDegreePlan(query)
    .then(result => {
            res.status(200);
            res.json({
                plan: result,
                time_taken: ((Date.now() - start).toString() + "ms")
            });
    })
    .catch(err => {
        errorHandler(err, "getDegreePlan", res);
    })
}

exports.updateDegreePlanName = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    console.log("(degreePlanCntrl/updateDegreePlanName) ", "req.params: ", req.params);
    // get user request information
    let query = {
        plan_id: req.params.plan_id,
        new_plan_name: req.params.new_name
    }
    
    // get from database
    degreePlanAPI.updateDegreePlanName(query)
    .then(result => {
            res.status(200);
            res.json({
                plan_id: result,
                time_taken: ((Date.now() - start).toString() + "ms")
            });
    })
    .catch(err => {
        errorHandler(err, "updateDegreePlanName", res);
    })
}

/* delete a degree plan */
exports.deleteDegreePlan = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    // get user request information
    console.log("(dPCntrl/deleteDegreePlan) received request with query: ", req.query);
    let query = {
        user_id: req.userid,
        plan_id: req.query.plan_id
    }

    // delete degree plan and referenced plan terms
    degreePlanAPI.deleteDegreePlan(query)
    .then(result => {
        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreePlan", res);
    })    
}

/**
 * DELETE api/degreeplan/terms
 * Delete multiple degree plan terms
 * @param {any} req 
 * @param {any} res 
 */
exports.deleteDegreeTermMultiple = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    console.log("(dpCntrl/deleteDegreeTermMultiple) hereeee");
    // delete multiple degree plans with userid and an array of plan ids
    let query = {
        plan_term_ids : req.body.plan_term_ids,
        plan_id       : req.body.plan_id,
        user_id       : req.userid
    }
    degreePlanAPI.deleteDegreeTermMultiple(query)
    .then(result => {
        res.status(200);
        res.json({
            plan: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreePlan", res);
    })
}

/**
 * Get degree plans
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreePlans = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    console.log("(dPController/getDP) here");
    let query = {
        user_id: req.userid
    }
    let result = await degreePlanAPI.getDegreePlans(query)
    .then(result => {
        res.status(200);
        res.json({
            plans: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreePlans", res);
    })
}

/**
 * Create an empty plan term
 * @param {any} req 
 * @param {any} res 
 */
exports.createTerm = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    
    const {plan_id, term} = req.body;
    degreePlanAPI.createTerm(plan_id, term, [])
    .then(result => {
        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createTerm", res);
    })
}

/** 
 * Save plan term
 * @param {any} req 
 * @param {any} res 
 */
exports.saveTerm = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    const { plan_term_id, courses } = req.body;
    let setParams = {
        courses: courses
    };
    degreePlanAPI.saveTerm(plan_term_id, setParams)
    .then(result => {
        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "saveTerm", res);
    })
}

/** 
 * Delete a degree plan term
 * @param {any} req 
 * @param {any} res 
 */
exports.deleteTerm = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint

    let query = {
        userId : req.userid,
        planId : req.params.plan_term_id
    }
    degreePlanAPI.deleteTerm(query)
    .then(result => {
        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteTerm", res);
    })
}


const errorHandler = (err, endpoint, res) => {
    console.error("(dPController/errorhandler) err: ", err);
    if (err.detail !== undefined && err.title != undefined) {
        /* this is internally formatted error */
        resHandler.respondWithCustomError(err.id, err.status, err.title, err.detail, res);
    }
    else {
        console.error("(degreePlanController/" + endpoint, err);
        resHandler.respondWithCustomError("000", "500", "Internal Server Error", err, res);
    }
}