var logger = require('./lib/logger.js');
var multicastListener = require('./lib/listeners/multicast.js');
var unicastListener = require('./lib/listeners/unicast.js');
var collector = require('./lib/requestCollector');

const EventEmitter = require("events");
const util = require('util');

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
    controller: myEmitter,
    respond: externalResponseHandler
};