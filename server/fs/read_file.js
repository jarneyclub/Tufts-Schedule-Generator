var fs = require('fs');
const path = require('path');
/*
fs.readFile('data.txt', 'utf8', async function (err, data) {
    var courses_json;
    if (err) throw err;
    courses_json = await JSON.parse(data);
    return courses_json
});
*/

module.exports.get_json = function get_json(callback) {
    fs.readFile(path.join(__dirname, '/scrape/data.txt'), 'utf8', function (err, data) {
        if (err) return callback(err);
        var courses_json;
        courses_json = JSON.parse(data);
        callback(null, courses_json)
    })
}

/*
exports.courses_json = courses_json;
*/