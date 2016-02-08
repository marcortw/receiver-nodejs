var fs = require('fs');
var tv4 = require('tv4');
var logger = require('./logger.js');
var path = require('path');

var demandSchema = JSON.parse(fs.readFileSync(path.join(__dirname, './schema/combined.schema.v8.json'), 'utf8'));

module.exports = {
    validate: function (acdpRequestObject, callback) {
        var valid = tv4.validate(acdpRequestObject, demandSchema);

        if (!valid) {
            callback(tv4.error, false);
        } else {
            callback(null, acdpRequestObject);
        }
    }
};
