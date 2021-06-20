const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');
const PlanTerm = mongoose.model('PlanTerm');
const { Heap } = require('heap-js');

/** Insert a degree plan in the database, that is 
 * one degree plan with 8 empty terms
 * @param {object} schema 
 * @returns {Promise} document or error
 */
exports.createNewDegreePlan = async (schema) => {
    try {
        // validate schema and create document
        let newPlan = new Plan(schema);
        await newPlan.save(); // insert
        // insert numNewTerms amount of new terms into this plan
        let numNewTerms = 8
        let insertedPlanTerms = [];
        let currTerm = 2218; 
        for (let i = 0; i < numNewTerms; i++) {
            let newPlanTerm = new PlanTerm({
                term: currTerm,
                plan_id: newPlan._id,
                courses: []
            });
            await newPlanTerm.save(); // insert
            // select information to return
            insertedPlanTerms.push({
                plan_term_id: newPlanTerm._id.valueOf(),
                term: newPlanTerm.term,
                courses: newPlanTerm.courses
            });
            // iterate to next term in sequence
            currTerm = await getNextTerm(currTerm);
        }
        // sort insertedPlanTerms
        const customPriorityComparator = (a, b) => a.term - b.term;
        const priorityQueue = new Heap(customPriorityComparator);
        priorityQueue.init(insertedPlanTerms);
        insertedPlanTerms = Heap.nsmallest(numNewTerms, priorityQueue);
        // formulate and send response
        let result = {
            plan_id: newPlan._id.valueOf(),
            plan_name: newPlan.plan_name,
            terms: insertedPlanTerms
        };
        return result;

    }
    catch (e) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw {code: 1, message: e.message};
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Get a degree plan from the database
 * @param {any} query 
 * @returns {Promise} document or error
 * EC ; 
 * - terms is not sorted (not handled)
 */
exports.getDegreePlan = async (query) => {
    try {
        let dbPlans = mongoose.connection.collection("plans"); // get MongoDB collection
        console.log("(database) getDegreePlan", "query: ", query);
        let matchStage = { $match: {
            user_id: query.user_id,
            _id: mongoose.Types.ObjectId(query.plan_id)
        }};
        let lookupStage = {
            $lookup: {
                from: "plan_terms",
                localField: "_id",
                foreignField: "plan_id",
                as: "terms"
            }
        };
        let projectionStage = {
            $project: {
                terms: {
                    $map: {
                        input: "$terms",
                        as: "el",
                        in: {
                            plan_term_id: "$$el._id",
                            term: "$$el.term",
                            courses: "$$el.courses"
                        }
                    }
                },
                plan_name: "$plan_name"
            }
        };
        let cursor = dbPlans.aggregate([matchStage, lookupStage, projectionStage]);
        // convert cursor to array
        let documents = [];
        await cursor.forEach((doc) => {
            // parse degree plan
            let docToInsert = {
                plan_name: doc["plan_name"],
                plan_id: doc["_id"].valueOf(),
                terms: doc["terms"]
            }
            documents.push(docToInsert);
        });
        if (documents.length === 0)
            throw "No degree plan could be found with given query.";
        // only get one degree plan (only one should exist anyways)
        return documents[0];
    }
    catch (e) {
        if (e.message.indexOf("validation failed") > -1) {
            /* error is mongoose validation error */
            throw { code: 1, message: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Delete a degree plan from the database
 * @param {any} query 
 * @returns {Promise} true or error
 * EC ;
 * - plan exists but a plan term does not exist (Not handled)
 * - plan does not exist but all plan terms exist (Not handled)
 * - neither the plan nor some plan terms exist (Not handled)
 */
exports.deleteDegreePlan = async (query) => {
    try {
        // get degree plan from database
        const { plan_name, plan_id, terms } = await this.getDegreePlan(query);

        let dbPlans = mongoose.connection.collection("plans"); // get MongoDB collection
        let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        // delete all referenced plan terms
        for (let i = 0; i < terms.length; i++) {
            const {courses, plan_term_id, term} = terms[i];
            await dbPlanTerms.deleteOne({_id: mongoose.Types.ObjectId(plan_term_id)})
        }
        // delete degree plan
        await dbPlans.deleteOne({_id: mongoose.Types.ObjectId(plan_id)});

        return true

    }
    catch (e) {
        console.error(e);
        throw { code: 4, message: e };
    }
}

/** Get all degree plans of a user
 * @param {object} query 
 * @returns {Promise} array or error
 * EC;
 * - terms is not sorted (not handled)
 */
exports.getDegreePlans = async (query) => {
    try {
        let dbPlans = mongoose.connection.collection("plans"); // get MongoDB collection
        let matchStage = { $match: { user_id: query.user_id }};
        let lookupStage = {
            $lookup: {
                from: "plan_terms",
                localField: "_id",
                foreignField: "plan_id",
                as: "terms"
            }
        };
        let projectionStage = {
            $project: {
                terms: {
                    $map: {
                        input: "$terms",
                        as: "el",
                        in: {
                            plan_term_id: "$$el._id",
                            term: "$$el.term",
                            courses: "$$el.courses"
                        }
                    }
                },
                plan_name: "$plan_name"
            }
        };
        let cursor = dbPlans.aggregate([matchStage, lookupStage, projectionStage]);
        // convert cursor to list
        let documents = [];
        await cursor.forEach((doc) => {
            let docToInsert = {
                plan_name: doc["plan_name"],
                plan_id: doc["_id"].valueOf(),
                terms: doc["terms"]
            }
            documents.push(docToInsert);
        });
        if (documents.length === 0)
            throw "No degree plan could be found with given query."

        return documents;
    }
    catch (e) {
        if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Create a term associted with a plan with
 *  empty courses
 * @param {object} schema 
 * @returns {Promise} string or error
 */
exports.createTerm = async (schema) => {
    try {
        let planTerm = new PlanTerm(schema);
        await planTerm.save();
        return planTerm._id.valueOf();
    }
    catch (e) {
        if (e.message.indexOf("validation failed") > -1) {
            /* error is mongoose validation error */
            throw { code: 1, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Update an existing plan term with new content
 * @param {object} plan_term_id 
 * @param {object} setParams 
 * @returns {Promise} string or error
 * TODO:
 * - EC ; no term exists with plan_term_id (not handled)
 */
exports.saveTerm = async (plan_term_id, setParams) => {
    try {
        // let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        let courses = setParams.courses;

        // cast gen_course_id in courses from string to ObjectId
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];
            course.gen_course_id = mongoose.Types.ObjectId(course.gen_course_id);
        }
        // update plan term in database
        let planTerm = await PlanTerm.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(plan_term_id)
        }, {
            courses: courses
        }, { 
            new: true,
            upsert: false
        });
        // confirm update
        if (planTerm === null)
            throw "Plan term with given identifier was not found"
        return planTerm._id.valueOf();
    }
    catch (e) {
        if (e.message.indexOf("Plan term") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Delete a plan term from database
 * @param {object} query query of item to delete
 * @returns {Promise} true or error
 * EC ;
 * - no term with given fields were found (not handled)
 */
exports.deleteTerm = async (query) => {
    try {
        
        let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        let deleteResult = await dbPlanTerms.deleteOne({ user_id: query.userId, _id: mongoose.Types.ObjectId(query.planId) });
        if (deleteResult.n === 0)
            throw "Plan term with given identifiers were not found"
        return true
    }
    catch (e) {
        if (e.message.indexOf("Plan term") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
        }
    }
}

/** Helper function for finding next term
 * @param {integer} currTerm 
 * @returns {integer} next term
 */
const getNextTerm = async (currTerm) => {
    let termCycle = [2, 4, 5, 8];
    let currIndTermCyc = termCycle.indexOf((currTerm % 10));
    if (currIndTermCyc === -1)
        throw Error("Season value in currTerm argument is invalid. Must be either 2, 4, 5, or 8.");
    // parse and update current year
    let currYear = parseInt(currTerm / 10);
    // increment year only when currently last season
    if (currIndTermCyc == 3)
        currYear = parseInt(currTerm / 10) + 1;
    // increment currIndTermCyc
    currIndTermCyc = ((currIndTermCyc + 1) % 4);
    // parse and update current season
    let currSeas = termCycle[currIndTermCyc];
    // put together updated values
    currTerm = 10 * currYear + currSeas;
    return currTerm
}