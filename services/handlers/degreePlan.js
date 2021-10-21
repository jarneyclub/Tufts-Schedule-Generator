const mongoose = require('mongoose');
require('../../models/external/Plan.js');
require('../../models/external/PlanTerm.js');
const Plan = mongoose.model('Plan');
const PlanTerm = mongoose.model('PlanTerm');
const { Heap } = require('heap-js');

// "FALL": "8",
// "SPRING": "2",
// "SUMMER": "5",
// "annual": "4"

/** Insert a degree plan in the database, that is 
 * one degree plan with 8 empty terms
 * @param {object} schema 
 * @returns {Promise} document or error
 */
const createNewDegreePlan = async (schema) => {
    try {
        // validate schema and create document
        let newPlan = new Plan(schema);
        await newPlan.save(); // insert
        // insert numNewTerms amount of new terms into this plan
        let numNewTerms = 8
        let insertedPlanTerms = []; // append inserted PlanTerm's to this array
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
        // convert term int ids to term descriptions (e.g. 2218 -> "Fall 2018")
        for (let i = 0; i < insertedPlanTerms.length; i++) {
            insertedPlanTerms[i].term = termIntegerToDesc(insertedPlanTerms[i].term);
        }
        // formulate and send response
        let result = {
            plan_id: newPlan._id.valueOf(),
            plan_name: newPlan.plan_name,
            user_id: newPlan.user_id,
            terms: insertedPlanTerms
        };
        return result;
    }
    catch (e) {
        errorHandler(e, "createNewDegreePlan");
    }
}

/** Get a degree plan from the database
 * @param {any} query 
 * @returns {Promise} document or error
 * EC ; 
 * - terms is not sorted (not handled)
 */
const getDegreePlan = async (query) => {
    try {
        let dbPlans = mongoose.connection.collection("plans"); // get MongoDB collection
        console.log("(database) getDegreePlan", "query: ", query);
        queryUserId = query.user_id;
        queryPlanId = query.plan_id;

        let matchStage = { $match: {
            user_id: queryUserId,
            _id: mongoose.Types.ObjectId(queryPlanId)
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
                plan_name: "$plan_name",
                user_id: "$user_id"
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
                user_id: doc["user_id"],
                terms: doc["terms"]
            }
            // convert term integer ids to desc e.g. 2218 -> "Fall 2018"
            planTerms = [];
            for (let i = 0; i < docToInsert.terms.length; i++) {
                let currTerm = docToInsert.terms[i];
                planTerms.push(currTerm);
            }
            planTerms.sort((termA, termB) => {
                if (termA.term < termB.term) {
                    return -1;
                } else if (termA.term > termB.term) {
                    return 1;
                } else {
                    return 0;
                }
            });
            // convert term integer ids to desc e.g. 2218 -> "Fall 2018"
            for (let i = 0; i < planTerms.length; i++) {
                planTerms[i].term = termIntegerToDesc(planTerms[i].term);
            }
            
            docToInsert.terms = planTerms; // update terms
            documents.push(docToInsert); // append to documents
        });
        // if (documents.length === 0)
            // throw { id: "202", status: "404", title: "Degree Plan Error", detail: "No degree plan could be found with given query." };
        // only get one degree plan (only one should exist anyways)
        return documents[0];
    }
    catch (e) {
        errorHandler(e, "getDegreePlan");
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
const deleteDegreePlan = async (query) => {
    try {
        // get degree plan from database
        const { plan_name, plan_id, terms, user_id } = await this.getDegreePlan(query);
        if (user_id !== query.user_id) {
            /* the owner of the plan is not the request sender */
            throw { id: "203", status: "403", title: "Degree Plan Error (deleteDegreePlan)", detail: "You (" + query.user_id + ") do not have permission to delete this degree plan." };
        }
        // delete all referenced plan terms
        let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        await dbPlanTerms.deleteMany({ plan_id: mongoose.Types.ObjectId(plan_id) }); // delete all plan terms
        // delete degree plan
        let dbPlans = mongoose.connection.collection("plans"); // get MongoDB collection
        await dbPlans.deleteOne({_id: mongoose.Types.ObjectId(plan_id), user_id: user_id});

        return true

    }
    catch (e) {
        errorHandler(e, "deleteDegreePlan");
    }
}

/** Delete degree plan terms from the database (only terms of one plan)
 * @param {any} query 
 * @returns {Promise} true or error
 */
const deleteDegreeTermMultiple = async (query) => {
    try {
        let plan_term_ids = query.plan_term_ids;
        let plan_id       = query.plan_id;
        let user_id       = query.user_id;

        let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        console.log("(dP/deleteDegreeTermMultiple) query: ", query);
        // delete all referenced plan terms
        for (let i = 0; i < plan_term_ids.length; i++) {
            await dbPlanTerms.deleteOne({
                _id     : mongoose.Types.ObjectId(plan_term_ids[i]), 
                plan_id : mongoose.Types.ObjectId(plan_id)
            });
        }
        // console.log("(dP/deleteDegreeTermMultiple) plan_id: ", plan_id);
        let newDegreePlan = getDegreePlan({
            user_id: user_id,
            plan_id: plan_id
        });
        return newDegreePlan;
    }
    catch (e) {
        errorHandler(e, "deleteDegreeTermMultiple");
    }
}

/** Get all degree plans of a user
 * @param {object} query 
 * @returns {Promise} array or error
 * EC;
 * - terms is not sorted (not handled)
 */
const getDegreePlans = async (query) => {
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
            // get terms 
            planTerms = [];
            for (let i = 0; i < docToInsert.terms.length; i++) {
                let currTerm = docToInsert.terms[i];
                planTerms.push(currTerm);
            }
            console.log("(getDegreePlans) planTerms before sort: ", planTerms);
            planTerms.sort((termA, termB) => {
                if (termA.term < termB.term) {
                    return -1;
                } else if (termA.term > termB.term) {
                    return 1;
                } else {
                    return 0;
                }
            });
            console.log("(getDegreePlans) planTerms after sort: ", planTerms);
            // convert term integer ids to desc e.g. 2218 -> "Fall 2018"
            for (let i = 0; i < planTerms.length; i++) {
                planTerms[i].term = termIntegerToDesc(planTerms[i].term);
            }
            docToInsert.terms = planTerms; // update terms
            documents.push(docToInsert);
        });

        return documents;
    }
    catch (e) {
        errorHandler(e, "getDegreePlans");
    }
}

/**
 * Update Degree Plan Name
 * @param {object} query
 * @return {string} 
 */
const updateDegreePlanName = async (query) => {
    try {
        let updatedPlan = await Plan.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(query.plan_id)
        }, {
            plan_name: query.new_plan_name
        }, {
            new: true,
            upsert: false
        });
        // confirm update
        if (updatedPlan === null)
            throw { id: "202", status: "404", title: "Degree Plan Error (updateDegreePlanName) ", detail: "Plan with given identifiers were not found" };
        return updatedPlan._id.valueOf();
    }
    catch (e) {
        errorHandler(e, "updateDegreePlanName");
    }
}

/**
 * Create a term associted with a plan with
 * empty courses
 * @param {*} planId
 * @param {*} planTermDesc
 * @param {*} arrCourses
 * @return {Promise} string or error
 */
const createTerm = async (planId, planTermDesc, arrCourses) => {
    try {
        let planTermInt = descToTermInteger(planTermDesc);
        let schema = {plan_id: planId, term: planTermInt, courses: arrCourses};
        let planTerm = new PlanTerm(schema);
        await planTerm.save();
        return planTerm._id.valueOf();
    }
    catch (e) {
        errorHandler(e, "createTerm");
    }
}

/** Update an existing plan term with new content
 * @param {object} plan_term_id 
 * @param {object} setParams 
 * @returns {Promise} string or error
 * TODO:
 * - EC ; no term exists with plan_term_id (not handled)
 */
const saveTerm = async (plan_term_id, setParams) => {
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
            throw { id: "202", status: "404", title: "Degree Plan Error (saveTerm)", detail: "Plan term with given identifiers were not found. (planTerm == null)" };
        return planTerm._id.valueOf();
    }
    catch (e) {
        errorHandler(e, "saveTerm");
    }
}

/** Delete a plan term from database
 * @param {object} query query of item to delete
 * @returns {Promise} true or error
 * EC ;
 * - no term with given fields were found (not handled)
 */
const deleteTerm = async (query) => {
    try {
        
        let dbPlanTerms = mongoose.connection.collection("plan_terms"); // get MongoDB collection
        let deleteResult = await dbPlanTerms.deleteOne({ user_id: query.userId, _id: mongoose.Types.ObjectId(query.planId) });
        if (deleteResult.n === 0)
            throw { id: "202", status: "404", title: "Degree Plan Error (deleteTerm)", detail: "Plan term with given identifiers were not found" };
        return true
    }
    catch (e) {
        errorHandler(e, "deleteTerm");
    }
}

////////////////////////////////////////
//                                    //
//              Helpers               //
//                                    //
////////////////////////////////////////

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
    return currTerm;
}

const termIntegerToDesc = (termInt) => {
    let mapIntToSeason = {
        "2": "Spring",
        "4": "Annual",
        "5": "Summer",
        "8": "Fall"
    }

    let termString = termInt.toString();
    let year = termString[0] + 0 + termString[1] + termString[2];
    let season = mapIntToSeason[termString[3]];
    if (season === "Annual") {
        year = year + "-" + (parseInt(year)+1).toString()
        return year + " " + "Annual";
    }
    else {
        return year + " " + season;
    }
}

const descToTermInteger = (termDesc) => {
    let mapSeasonToInt = {
        "Spring" : "2",
        "Annual" : "4",
        "Summer" : "5",
        "Fall"   : "8"
    }

    if (termDesc.indexOf("Annual") > -1) {
        let year = termDesc.substring(0, 4);
        return parseInt(year[0] + year[2] + year[3] + mapSeasonToInt["Annual"]);
    }
    else {
        let year = termDesc.substring(0, 4);
        let season = termDesc.substring(5, termDesc.length);
        return parseInt(year[0] + year[2] + year[3] + mapSeasonToInt[season]);
    }
}

const errorHandler = (e, functionName) => {
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Degree Plan Error (" + functionName + ")" , detail: e.message };
        }
        else if (e.message.indexOf("No degree plan") > -1) {
            /* error is mongoose validation error */
            throw { id: "202", status: "404", title: "Degree Plan Error (" + functionName + ")", detail: e.message };
        }
        else {
            throw { id: "000", status: "500", title: "Degree Plan Error (" + functionName + ")", detail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
        else {
            throw { id: "000", status: "500", title: "Degree Plan Error (" + functionName + ")", detail: e.message };
        }
    }
}

module.exports.createNewDegreePlan = createNewDegreePlan;
module.exports.getDegreePlan = getDegreePlan;
module.exports.updateDegreePlanName = updateDegreePlanName;
module.exports.deleteDegreePlan = deleteDegreePlan;
module.exports.getDegreePlans = getDegreePlans;
module.exports.createTerm = createTerm;
module.exports.saveTerm = saveTerm;
module.exports.deleteTerm = deleteTerm;
module.exports.getNextTerm = getNextTerm;
module.exports.termIntegerToDesc = termIntegerToDesc;
module.exports.descToTermInteger = descToTermInteger;
module.exports.deleteDegreeTermMultiple = deleteDegreeTermMultiple;