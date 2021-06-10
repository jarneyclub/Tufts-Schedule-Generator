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
            parts: schema.parts
        });

        let insertedDR = await dr.save();

        return insertedDR._id.valueOf();
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
                "date_created": doc.date_created
            };
            documents.push(docParsed);
        });
        // TODO: aggregate with renamed fields for more user friendly response (but need some documents in collection first)
        return documents;
    }
    catch (e) {
        console.error(e);
        throw { code: 4, message: e };
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
        console.error(e);
        throw { code: 4, message: e };
    }
}

/**
 * Copy public degree requirement into private
 * @param {object} schema 
 * @returns {Promise} string or error
 */
exports.copyDegreeReqPublicToPrivate = async (pub_dr_id, userId) => {
    try {
        console.log("heeeere");
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
            user_id: userId
        })
        let insertedDr = await drPriv.save();
        // parse inserted private degree requirement for api response
        let insertedDrParsed = {
            priv_dr_id   : insertedDr._id.valueOf(),
            program_name : insertedDr.program_name, 
            school       : insertedDr.school,
            degree       : insertedDr.degree,
            parts        : insertedDr.parts
        };
        return insertedDrParsed;
    }
    catch (e) {
        if (e.message.indexOf("validation failed") > -1) {
            /* error is mongoose validation error */
            throw { code: 1, message: e.message };
        }
        else if (e.message.indexOf("No public") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
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
                priv_dr_id   : doc._id.valueOf(),
                program_name : doc.program_name,
                school       : doc.school,
                degree       : doc.degree,
                parts        : doc.parts 
            };
            documents.push(docParsed);
        });

        if (documents.length === 0)
            throw "No private degree requirement could be found with given user_id.";

        return documents

    }
    catch (e) {
        if (e.message.indexOf("No private") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
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
        let dr = new DegreeReqPrivate({
            program_name : schema.programName,
            school       : schema.school,
            degree       : schema.degree,
            parts        : schema.parts,
            user_id      : userId
        });

        let insertedDR = await dr.save();

        return insertedDR._id.valueOf();
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
            priv_dr_id   : doc._id.valueOf(),
            program_name : doc.program_name,
            school       : doc.school,
            degree       : doc.degree,
            parts        : doc.parts
        };
        return docParsed;
    }
    catch (e) {
        if (e.message.indexOf("No private") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
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
            program_name : schema.programName,
            school       : schema.school,
            degree       : schema.degree,
            parts        : schema.parts
        }, {
            new: true,
            upsert: false
        });
        if (dr === null)
            throw "Private degree requirement with given identifier was not found."
        return dr._id.valueOf();
    }
    catch (e) {
        if (e.message.indexOf("was not found") > -1) {
            /* error is mongoose validation error */
            throw { code: 2, message: e.message };
        }
        else {
            console.error(e);
            throw { code: 4, message: e };
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
        console.error(e);
        throw { code: 4, message: e };
    }
}