const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');

exports.saveActivity = async (userid, feature) => {
    try {
        let newActivity = new Activity({
            userid: userid,
            feature: feature,
            date: Date.now()   
        });
        
        newActivity.save();
    }
    catch (e) {
        errorHandler(e, "saveActivity");
    }
}