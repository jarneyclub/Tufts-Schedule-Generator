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
 * @param {*} id
 * @param {*} status
 * @param {*} title
 * @param {*} detail
 * @param {*} res
 */
exports.respondWithCustomError = (id, status, title, detail, res) => {
    try {
        res.status(parseInt(status));
        res.json({
            errors: [
                {
                    id: id,
                    status: status,
                    title: title,
                    detail: detail
                }
            ]
        });
    }
    catch (e) {
        console.error(e);
        // console.error("(resHandler/respondWithCustomError) status: ", status);
    }
}