const mongoose = require('mongoose');
const DegreeReqPrivate = mongoose.model('DegreeReqPrivate');
const DegreeReqPublic = mongoose.model('DegreeReqPublic');
const { Heap } = require('heap-js');

/**
 * Create a public degree requirement
 * @param {any} req 
 * @param {any} res 
 */
exports.createDegreeReqPublic = async (schema) => {
    try {
        let dr = new DegreeReqPublic({
            program_name: schema.programName,
            school: schema.school,
            degree: schema.degree,
            parts: schema.parts,
            part_id_tracker: schema.partIdTracker
        });

        let insertedDR = await dr.save();

        return insertedDR._id.valueOf();
    }
    catch (e) {
        console.error("(degreeReq/createDegreeReqPublic) e: ", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("validation failed") > -1) {
                /* error is mongoose validation error */
                // throw { code: 1, message: e.message };
                throw { id: "201", status: "400", title: "Degree Requirement Error", detail: e.message };
            }
            else {
                // console.error(e);
                // throw { code: 4, message: e };
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
            }
        }
        else {
            // console.error(e);
            // throw { code: 4, message: e };
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e };
        }
    }
}

/**
 * Get all public degree requirements
 * @returns 
 */
exports.getDegreeReqsPublic = async () => {
    try {
        let dbDRPub = mongoose.connection.collection("degree_reqs_public"); // get MongoDB collection
        let cursor = await dbDRPub.find();
        // convert cursor into list
        let documents = [];
        await cursor.forEach((doc) => {
            // parse degree requirement
            let docParsed = {
                "pub_dr_id": doc._id.valueOf(),
                "program_name": doc.program_name,
                "school": doc.school,
                "degree": doc.degree,
                "parts": doc.parts,
                "date_created": doc.date_created,
                "part_id_tracker": doc.part_id_tracker
            };
            documents.push(docParsed);
        });
        // TODO: aggregate with renamed fields for more user friendly response (but need some documents in collection first)
        return documents;
    }
    catch (e) {
        console.error("(degreeReq/getDegreeReqsPrivate) e: ", e);
        throw { id: "", status: "500", title: "Degree Requirement Error", detail: e };
        // console.error(e);
        // throw { code: 4, message: e };
    }
}

/**
 * Delete a public degree requirement
 * @param {any} pubDrId 
 * @returns 
 */
exports.deleteDegreeReqPublic = async (pubDrId) => {
    try {
        let dbDRPub = mongoose.connection.collection("degree_reqs_public"); // get MongoDB collection
        await dbDRPub.deleteOne({
            _id: mongoose.Types.ObjectId(pubDrId)
        });

        return true;
    }
    catch (e) {
        console.error("(degreeReq/getDegreeReqsPrivate) e: ", e);
        throw { id: "", status: "500", title: "Degree Requirement Error", detail: e };
        // console.error(e);
        // throw { code: 4, message: e };
    }
}

/**
 * Copy public degree requirement into private
 * @param {object} schema 
 * @returns {Promise} string or error
 */
exports.copyDegreeReqPublicToPrivate = async (pub_dr_id, userId) => {
    try {
        let dbDRPub = mongoose.connection.collection("degree_reqs_public"); // get MongoDB collection
        // let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        let drPub = await dbDRPub.findOne({
            _id: mongoose.Types.ObjectId(pub_dr_id)
        });

        if (drPub === null)
            throw "No public degree requirement was found with given identifier."

        // copy and insert private degree requirement into database
        let drPriv = new DegreeReqPrivate({
            program_name: drPub.program_name,
            school: drPub.school,
            degree: drPub.degree,
            parts: drPub.parts,
            user_id: userId,
            part_id_tracker: drPub.part_id_tracker
        })
        let insertedDr = await drPriv.save();
        // parse inserted private degree requirement for api response
        let insertedDrParsed = {
            priv_dr_id      : insertedDr._id.valueOf(),
            program_name    : insertedDr.program_name, 
            school          : insertedDr.school,
            degree          : insertedDr.degree,
            parts           : insertedDr.parts,
            part_id_tracker : insertedDr.part_id_tracker
        };
        return insertedDrParsed;
    }
    catch (e) {
        console.error("(degreeReq/copyDegreeReqPublicToPrivate) e: ", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("validation failed") > -1) {
                /* error is mongoose validation error */
                throw { id: "201", status: "400", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 1, message: e.message };
            }
            else if (e.message.indexOf("No public") > -1) {
                /* error is mongoose validation error */
                throw { id: "202", status: "404", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 2, message: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
                // console.error(e);
                // throw { code: 4, message: e };
            }
        }
        else {
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e.message };
            // console.error(e);
            // throw { code: 4, message: e };
        }
    }
}


 /**
  * Copy private degree requirement into public.
  *
  * @param {*} priv_dr_id
  * @param {*} userId
  * @return {*} 
  */
 exports.copyDegreeReqPrivateToPublic = async (priv_dr_id) => {
    try {
        let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        // let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        let drPriv = await dbDRPriv.findOne({
            _id: mongoose.Types.ObjectId(priv_dr_id)
        });

        if (drPriv === null)
            throw "No private degree requirement was found with given identifier.";

        // copy and insert private degree requirement into database
        let drPub = new DegreeReqPublic({
            program_name: drPriv.program_name,
            school: drPriv.school,
            degree: drPriv.degree,
            parts: drPriv.parts,
            part_id_tracker: drPriv.part_id_tracker
        });
        let insertedDr = await drPub.save();
        // parse inserted private degree requirement for api response
        let insertedDrParsed = {
            pub_dr_id      : insertedDr._id.valueOf(),
            program_name    : insertedDr.program_name, 
            school          : insertedDr.school,
            degree          : insertedDr.degree,
            parts           : insertedDr.parts,
            part_id_tracker : insertedDr.part_id_tracker
        };
        return insertedDrParsed;
    }
    catch (e) {
        console.error("(degreeReq/copyDegreeReqPrivateToPublic) e: ", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("validation failed") > -1) {
                /* error is mongoose validation error */
                throw { id: "201", status: "400", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 1, message: e.message };
            }
            else if (e.message.indexOf("No public") > -1) {
                /* error is mongoose validation error */
                throw { id: "202", status: "404", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 2, message: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
                // console.error(e);
                // throw { code: 4, message: e };
            }
        }
        else {
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e.message };
            // console.error(e);
            // throw { code: 4, message: e };
        }
    }
}

/**
 * Get all private degree requirements of a user
 * @param {object} query userId
 * @returns {Promise} array or error
 */
exports.getDegreeReqsPrivate = async (query) => {
    try {
        let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        let cursor = dbDRPriv.find({
            user_id: query.userId
        })
        // convert cursor to array
        let documents = [];
        await cursor.forEach((doc) => {
            // parse degree requirement
            let docParsed = {
                priv_dr_id      : doc._id.valueOf(),
                program_name    : doc.program_name,
                school          : doc.school,
                degree          : doc.degree,
                parts           : doc.parts,
                part_id_tracker : doc.part_id_tracker
            };
            documents.push(docParsed);
        });

        return documents

    }
    catch (e) {
        console.error("(degreeReq/getDegreeReqsPrivate) e: ", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("No private") > -1) {
                /* error is mongoose validation error */
                throw { id: "202", status: "404", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 2, message: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 4, message: e };
            }
        }
        else {
            console.error("(degreeReq) e:", e);
            throw { id: "", status: "500", title: "Internal Server Error", detail: e };
            // throw { code: 4, message: e };
        }
    }
}

/**
 * Create private degree requirement
 * @param {string} userId 
 * @param {object} schema 
 * @returns 
 */
exports.createDegreeReqPrivate = async (userId, schema) => {
    try {
        console.log("(degreeReq/createDegreeReqPrivate) here");
        let dr = new DegreeReqPrivate({
            program_name    : schema.programName,
            school          : schema.school,
            degree          : schema.degree,
            parts           : schema.parts,
            user_id         : userId,
            part_id_tracker : schema.partIdTracker
        });

        let insertedDR = await dr.save();

        return {
            priv_dr_id: insertedDR._id.valueOf(),
            program_name: schema.programName,
            school: schema.school,
            degree: schema.degree,
            parts: schema.parts,
            part_id_tracker: schema.partIdTracker
        }
    }
    catch (e) {
        console.error("(degreeReq/createDegreeReqPrivate) e: ", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("validation failed") > -1) {
                /* error is mongoose validation error */
                throw { id: "201", status: "400", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 1, message: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
                // throw { code: 4, message: e };
            }
        }
        else {
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e.message };
            // throw { code: 4, message: e };
        }
    }
}

/**
 * Get a private degree requirement
 * @param {object} query userId and privDrId
 * @returns {Promise} object or error
 */
exports.getDegreeReqPrivate = async (query) => {
    try {
        let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        // get document with query
        let doc = await dbDRPriv.findOne({
            user_id : query.userId,
            _id     : mongoose.Types.ObjectId(query.privDrId)
        })
        if (doc === null)
            throw "No private degree requirement with given fields was found."
        // parse document for api response
        let docParsed = {
            priv_dr_id      : doc._id.valueOf(),
            program_name    : doc.program_name,
            school          : doc.school,
            degree          : doc.degree,
            parts           : doc.parts,
            part_id_tracker : doc.part_id_tracker
        };
        return docParsed;
    }
    catch (e) {
        if (e.message !== undefined) {
            if (e.message.indexOf("No private") > -1) {
                /* error is resource not found */
                throw { id: "202", status: "404", title: "Degree Requirement Error", detail: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
            }
        }
        else {
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e.message };
        }
    }
}

/**
 * Save/Update a private degree requirement
 * @param {string} priv_dr_id 
 * @param {object} schema 
 * @returns 
 */
exports.saveDegreeReqPrivate = async (priv_dr_id, schema) => {
    try {
        // update private degree requirement in database
        let dr = await DegreeReqPrivate.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(priv_dr_id)
        }, {
            program_name    : schema.programName,
            school          : schema.school,
            degree          : schema.degree,
            parts           : schema.parts,
            part_id_tracker : schema.partIdTracker
        }, {
            new: true,
            upsert: false
        });
        if (dr === null)
            throw "Private degree requirement with given identifier was not found."
        return dr._id.valueOf();
    }
    catch (e) {
        console.error("(saveDegreeReqPrivate) e:", e);
        if (e.message !== undefined) {
            if (e.message.indexOf("was not found") > -1) {
                /* error is mongoose validation error */
                throw { id: "202", status: "404", title: "Degree Requirement Error", detail: e.message };
            }
            else {
                throw { id: "203", status: "400", title: "Degree Requirement Error", detail: e.message };
            }
        }
        else {
            throw { id: "", status: "500", title: "Degree Requirement Error", detail: e.message };
        }
    }
}

/**
 * Delete a private degree requirement
 * @param {object} query 
 * @returns 
 */
exports.deleteDegreeReqPrivate = async (query) => {
    try {
        let dbDRPriv = mongoose.connection.collection("degree_reqs_private"); // get MongoDB collection
        await dbDRPriv.deleteOne({ 
            _id     : mongoose.Types.ObjectId(query.privDrId),
            user_id : query.userId
        });

        return true;
    }
    catch (e) {
        console.error("(deleteDegreeReqPrivate) e:", e);
        throw { id: "", status: "500", title: "Internal Server Error", detail: e };
    }
}