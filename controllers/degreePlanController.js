/*
* Name: degreePlanController.js
* API endpoints implementation for degree plan related operations
* 
* 
*/

// load database api
const degreePlanAPI = require('../services/handlers/degreePlan.js');
const analyticsHandler = require('../services/handlers/analytics.js');
const errorHandler = require("./utils/controllerErrorHandler.js").getErrorHandler("degreePlanController");
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
        
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "createDegreePlan");
        }

        res.status(200);
        res.json({
            plan: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createDegreePlan", res, req.userid, req.role);
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

        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "getDegreePlan");
        }

        res.status(200);
        res.json({
            plan: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreePlan", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "updateDegreePlanName");
        }

        res.status(200);
        res.json({
            plan_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "updateDegreePlanName", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "deleteDegreePlan");
        }

        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreePlan", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "deleteDegreeTermMultiple");
        }

        res.status(200);
        res.json({
            plan: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteDegreePlan", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "getDegreePlans");
        }

        res.status(200);
        res.json({
            plans: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "getDegreePlans", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "createTerm");
        }

        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "createTerm", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "saveTerm");
        }

        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "saveTerm", res, req.userid, req.role);
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
        // save activity if user is not developer
        if (req.role !== "developer") {
            analyticsHandler.saveApiUse(req.userid, "deleteTerm");
        }

        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "deleteTerm", res, req.userid, req.role);
    })
}
