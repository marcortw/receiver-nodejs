var config = require('../lib/configloader');

// Constructor
function Response() {
    this.response = {};
    this.response.type = "ACDPRESPONSE";
    this.response.receiver = config.get('receiver:version');
}

Response.prototype.addResponse = function (id, state) {
    this.response.demands = ( typeof this.response.demands != 'undefined' && this.response.demands instanceof Array ) ? this.response.demands : [];
    this.response.demands.push({id: id, state: state});
};

module.exports = Response;