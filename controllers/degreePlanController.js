// load database api
const degreePlanAPI = require('../services/handlers/degreePlan.js');
const errorHandler = require('../services/handlers/errorHandler');
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
        user_id: req.user_id
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
            errorHandler(res, err, start);
        }
    );
}

/**
 * Get a degree plan
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreePlan = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    console.log("(controllers/getDegreePlan) ", "req.params: ", req.params);
    // get user request information
    let query = {
        user_id: req.user_id,
        plan_id: req.params.plan_id
    }
    
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
        errorHandler(res, err, start);
    })
}

/* delete a degree plan */
exports.deleteDegreePlan = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    // get user request information
    let query = {
        user_id: req.user_id,
        plan_id: req.params.plan_id
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
        errorHandler(res, err, start);
    })    
}

/**
 * Get degree plans
 * @param {any} req 
 * @param {any} res 
 */
exports.getDegreePlans = async (req, res) => {
    var start = Date.now(); // begin timing API endpoint
    
    let query = {
        user_id: req.user_id
    }
    degreePlanAPI.getDegreePlans(query)
    .then(result => {
        res.status(200);
        res.json({
            plans     : result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(res, err, start);
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
    let schema = {
        plan_id: plan_id,
        term: term,
        courses: []
    }
    degreePlanAPI.createTerm(schema)
    .then(result => {
        res.status(200);
        res.json({
            plan_term_id: result,
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(res, err, start);
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
        errorHandler(res, err, start);
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
        userId : req.user_id,
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
        errorHandler(res, err, start);
    })
}