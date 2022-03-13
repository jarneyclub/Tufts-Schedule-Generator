/*
* Name: analyticsController.js
* API endpoints implementation for frontend usage analytics operations.
* 
* 
*/


const analyticsHandler = require('../services/handlers/analytics.js');
const errorHandler = require("./utils/controllerErrorHandler.js").getErrorHandler("analyticsController");

exports.saveFrontendUse = async (req, res) => {
    const start = Date.now();
    const {feature, data} = req.body;
    analyticsHandler.saveFrontendUse(feature, data)
    .then(result => {
        res.status(200);
        res.json({
            time_taken: ((Date.now() - start).toString() + "ms")
        });
    })
    .catch(err => {
        errorHandler(err, "saveFrontendUse", res, req.userid, req.role);
    })
}
