var validator = require('./acdpDraft01.js');
var logger = require('./logger.js');
const EventEmitter = require("events");
const util = require('util');

var responseFunction;

/**
 *
 * @param acdpRequestObject, already JSONparsed
 * @param callback
 */
var receiveAcdpRequest = function (options, acdpRequestObject, callback) {
    if (acdpRequestObject && typeof acdpRequestObject === 'object') {
        validator.validate(acdpRequestObject, function (err, result) {
            if (err) {
                options.valid = false;
                logger.debug('received an invalid message');
                myEmitter.emit('invalidrequest', options, acdpRequestObject);
            } else {
                options.valid = true;
                logger.debug('received a valid message');
                myEmitter.emit('validrequest', options, acdpRequestObject);
            }

            // regardless of if we have an error, we need to respond adequately, either through the injected function or on our own
            if (typeof externalResponseHandler == 'function') {
                externalResponseHandler(options, acdpRequestObject, function (err, result) {
                    if (err) {
                        logger.error(err);
                        if (callback) callback(err, null);
                    } else {
                        if (callback) callback(null, result);
                    }
                });
            } else {
                if (options.valid) {
                    // prepare a default response
                    var defaultResponse = {
                        "type": "ACDPRESPONSE",
                        "receiver": {
                            "description": "Default ACDP Receiver"
                        }
                    };
                    defaultResponse.demands = [];
                    acdpRequestObject.demands.forEach(function (demand) {
                        var demandId;
                        if(typeof demand.producer === 'undefined'){
                            demandId = demand.consumer.id;
                        } else {
                            demandId = demand.producer.id;
                        }
                        defaultResponse.demands.push({'id': demandId, 'state': 'RECEIVED'});
                    });
                    if (callback) callback(null, defaultResponse);
                } else {
                    if (callback) callback(new Error('invalid ACDP message'));
                }
            }
        })
    } else {
        if (callback) callback(new Error('Not a valid object'));
    }
};

var externalResponseHandler;

function MyEmitter() {
    EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);
const myEmitter = new MyEmitter();


module.exports = {
    events: myEmitter,
    receiveAcdpRequest: receiveAcdpRequest,
    handleAcdpRequest: function (externalResponseFunction) {
        externalResponseHandler = externalResponseFunction;
    }
};