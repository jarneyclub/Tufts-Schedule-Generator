/*
* Name: analytics.js
* Functions for saving usage information into the database
*/

const mongoose = require('mongoose');
const ApiError = mongoose.model('ApiError');
const ApiUse = mongoose.model('ApiUse');
const FrontendUse = mongoose.model('FrontendUse');


exports.saveApiError = async (userid, feature, errid, statusCode, errtitle, errdetails) => {
    try {
        let newApiError = new ApiError({
            type: "api_error",
            userid: userid,
            feature: feature,
            date: Date.now(),
            status: statusCode,
            errid: errid,
            errtitle: errtitle,
            errdetails: errdetails
        });
        newApiError.save();
    } catch (e) {
        errorHandler(e, "saveApiError");
    }
}

exports.saveApiUse = async (userid, feature) => {
    try {
        let newApiUse = new ApiUse({
            type: "api_use",
            userid: userid,
            feature: feature,
            date: Date.now()   
        });
        newApiUse.save();
    }
    catch (e) {
        errorHandler(e, "saveApiUse");
    }
}

exports.saveFrontendUse = async (feature, data) => {
    try {
        let newFrontendUse = new FrontendUse({
            type: "frontend_use",
            feature: feature,
            data: data,
            date: Date.now()
        });
        await newFrontendUse.save();
        return newFrontendUse._id.valueOf();
    }
    catch (e) {
        errorHandler(e, "saveFrontendUse");
    }
}

const errorHandler = (e) => {
    console.log("analytics error");
    throw e;
}
