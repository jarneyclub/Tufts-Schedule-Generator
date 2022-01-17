const mongoose = require('mongoose');
const ApiError = mongoose.model('ApiError');
const ApiUse = mongoose.model('ApiUse');
const FrontendUse = mongoose.model('FrontendUse');


// exports.saveApiError = async (userid, feature, statusCode, errid, )
// 
exports.saveErrorActivity = async (userid, feature, statusCode, errorString) => {
    try {
        
        let newErrorActivity = new ErrorActivity({
            userid: userid,
            feature: feature,
            isError: true,
            status: statusCode,
            error: errorString,
            date: Date.now()
        });
        
        newErrorActivity.save();
    }
    catch (e) {
        errorHandler(e, "saveErrorActivity");
    }
}

exports.saveNormalActivity = async (userid, feature) => {
    try {
        
        let newNormalActivity = new NormalActivity({
            userid: userid,
            feature: feature,
            isError: false,
            date: Date.now()   
        });
        
        newNormalActivity.save();
    }
    catch (e) {
        errorHandler(e, "saveNormalActivity");
    }
}
