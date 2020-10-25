var fs = require('fs');
const path = require('path');

/* Read ./scrape/data.txt file and retrieve JSON course catalog
*  Call callback function with parsed JSON
*/
module.exports.get_json = function get_json(callback) {
    var data = fs.readFileSync(path.join(__dirname, '/scrape/data.txt'), 'utf8');
    
    // parse course catalog into JSON object
    var courses_json;
    courses_json = JSON.parse(data);

    callback(null, courses_json);

    // fs.readFile(path.join(__dirname, '/scrape/data.txt'), 'utf8', function (err, data) {
        //callback with error
        // if (err) return callback(err);
// 
        // console.log("running get_json");
// 
       // parse course catalog into JSON object
        // var courses_json;
        // courses_json = JSON.parse(data);
// 
        // callback(null, courses_json);
    // })
}

/*
exports.courses_json = courses_json;
*/