var fs = require('fs');
var path = require('path');
var tv4 = require('tv4');
var logger = require('./logger.js');


var demandSchema = JSON.parse(fs.readFileSync(path.join(__dirname, './schema/acdprequest.schema.v0.1.0.json'), 'utf8'));

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
