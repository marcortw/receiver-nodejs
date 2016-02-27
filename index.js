var logger = require('./lib/logger.js');
var multicastListener = require('./lib/listeners/multicast.js');
var unicastListener = require('./lib/listeners/unicast.js');
var collector = require('./lib/requestCollector');
var config = require('./lib/configloader');

const EventEmitter = require("events");
const util = require('util');


// user supplied config, e.g. jwe key
var initialized = false;

/**
 *
 * @param options
 * @param callback
 * @returns {*}
 */
var init = function (options, callback) {
    var retMsg = "";
    if (!initialized) {
        if (options.key) {
            try {
                var key = JSON.stringify(options.key);
                config.set('encryption:jwekey', key);
                retMsg += 'Supplied key has been added to the configuration. '
            } catch (e) {
                var errMsg = 'Supplied key is not a valid JSON structure.';
                logger.error(e);
                return new Error(errMsg)
            }
        }
        logger.trace("CONFIGURATION AFTER USER-INIT: " + JSON.stringify(config.get()));
        return retMsg;

    } else {
        var msg = 'User-supplied config has already been initialized!!';
        logger.error(msg);
        return new Error(msg);
    }
};

multicastListener.start();
unicastListener.start();

function MyEmitter() {
    EventEmitter.call(this);
}

util.inherits(MyEmitter, EventEmitter);
const myEmitter = new MyEmitter();

/**
 * Catches valid requests from the collector
 */
collector.events.on('validrequest', function (options, acdprequest) {
    logger.debug('a valid event from collector occurred!');
    myEmitter.emit('validrequest', options, acdprequest);
});

/**
 * Catches invalid requests from the collector
 */
collector.events.on('invalidrequest', function (options, acdprequest) {
    logger.debug('an invalid event from collector occurred!');
    myEmitter.emit('invalidrequest', options, acdprequest);
});

var userCallback;

function notificationHandler(options, acdprequest, callback) {
    userCallback
}

function externalResponseHandler(externalResponseFunction) {
    if (externalResponseFunction.length != 3) {
        logger.error('Response handler function must be constructed with {options},{acdprequest},callback().')
    } else {
        collector.handleAcdpRequest(externalResponseFunction);
    }
}

module.exports = {
    init: init,
    controller: myEmitter,
    respond: externalResponseHandler
};