const analyticsHandler = require('../../services/handlers/analytics.js');

/**
 * Creates a single resource object in JSON:API v1.0 standard
 * View https://jsonapi.org/
 *
 * @param {*} attrs
 * @param {*} type
 * @param {*} id
 * @return {*} 
 */
exports.makeIntoSingleResourceObject = (attrs, type, id) => {
    return {
        id: id,
        type: type,
        attributes: attrs
    }
}

/**
 * Sends an error as a response in JSON:API v1.0 standard
 * View https://jsonapi.org/
 * @param {*} userid
 * @param {*} feature
 * @param {*} errid
 * @param {*} status
 * @param {*} title
 * @param {*} detail
 * @param {bool} saveToDb
 * @param {*} res
 */
exports.respondWithCustomError = (userid, feature, errid, status, err_title, err_desc, err_message, saveToDb, res) => {
    if (saveToDb) {
        analyticsHandler.saveApiError(userid, feature, errid, status, err_title, err_message);
    }

    try {
        res.status(parseInt(status));
        res.json({
            errors: [
                {
                    id: errid,
                    status: status,
                    title: err_title,
                    detail: err_desc
                }
            ]
        });
    }
    catch (e) {
        console.error(e);
        // console.error("(resHandler/respondWithCustomError) status: ", status);
    }
}