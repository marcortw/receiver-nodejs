var fs = require('fs');
var tv4 = require('tv4');
var logger = require('../lib/logger.js');

var demandSchema = JSON.parse(fs.readFileSync('C:/Users/mschnueriger/Documents/Oxford/MSc/Thesis/schema/combined.schema.v7.json', 'utf8'));

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
