//process.env.DEBUG = "*";
var logger = require('debug');


var error = logger('acdp-receiver:error');

var info = logger('acdp-receiver:info');
// set this namespace to log via console.log
info.log = console.log.bind(console); // don't forget to bind to console!

var debug = logger('acdp-receiver:debug');
var trace = logger('acdp-receiver:trace');

// set all output to go via console.info
// overrides all per-namespace log settings
logger.log = console.info.bind(console);



module.exports = {
    trace: trace,
    debug: debug,
    error: error,
    info: info
};