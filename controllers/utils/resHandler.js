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
 * Optionally saves the error in analytics to the database.
 * View https://jsonapi.org/
 * @param {String} userid affected user's user id
 * @param {String} feature feature/endpoint in which this error occurred
 * @param {String} errid unique backend error id
 * @param {String} status HTTP status code of error, e.g. ‘402’
 * @param {String} err_title Title of error
 * @param {String} err_desc Description of error sent in response
 * @param {String} err_message Description of error saved in db
 * @param {bool} saveToDb whether to save the error in the analyics database
 * @param {*} res the response object
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
