var validator = require('./acdpDraft01.js');
var logger = require('./logger.js');
const EventEmitter = require("events");
const util = require('util');
var config = require('../lib/configloader');
var crypto = require('./crypto');
var async = require('async');

var responseFunction;

/**
 *
 * @param acdpObject, already JSONparsed
 * @param callback
 */
var receiveAcdpMessage = function (options, acdpObject, callback) {
    if (acdpObject && typeof acdpObject === 'object') {
        async.waterfall([
            function (callback) {
                if (acdpObject.type == "ACDPWRAPPER") {
                    if (acdpObject.jwe) {
                        crypto.decrypt(acdpObject.jwe, function (err, result) {
                            if (err) {
                                options.wrapperState = {"jwe": err.message};
                                callback(null, acdpObject); // continue until the external response handler can decide what to do
                            } else {
                                try {
                                    options.wrapperState = {"jwe": "decrypted"};
                                    var acdpRequestObject = JSON.parse(result);
                                    callback(null, acdpRequestObject);
                                } catch (e) {
                                    logger.error(e);
                                    callback(e);
                                }
                            }
                        })
                    } else {
                        // TODO: Parse other message types
                        callback(new Error('Unsupported message wrapper type'));
                    }
                } else {
                    callback(null, acdpObject); // just assume it's not a wrapped message
                }
            },
            function (acdpRequestObject, callback) {
                validator.validate(acdpRequestObject, function (err, result) {
                    if (err) {
                        options.valid = false;
                        logger.debug('received an invalid message');
                        myEmitter.emit('invalidrequest', options, acdpRequestObject);
                    } else {
                        options.valid = true;
                        logger.debug('received a valid message');
                        logger.trace('Message: ' + JSON.stringify(acdpRequestObject));
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
                        // prepare a default response if no external response handler is defined
                        if (options.valid) {
                            var defaultResponse = {
                                "type": "ACDPRESPONSE",
                                "receiver": {
                                    "description": config.get('receiver:version')
                                },
                                "request": {
                                    "state": "VALID"
                                }
                            };
                            defaultResponse.demands = [];
                            acdpObject.demands.forEach(function (demand) {
                                var demandId;
                                if (typeof demand.producer === 'undefined') {
                                    demandId = demand.consumer.id;
                                } else {
                                    demandId = demand.producer.id;
                                }
                                defaultResponse.demands.push({'id': demandId, 'state': 'RECEIVED'});
                            });
                            if (callback) callback(null, defaultResponse);
                        } else {
                            var defaultResponse = {
                                "type": "ACDPRESPONSE",
                                "receiver": {
                                    "description": config.get('receiver:version')
                                },
                                "request": {
                                    "state": "INVALID"
                                }
                            };
                            if (callback) callback(new Error('invalid ACDP message'), defaultResponse);
                        }
                    }
                })
            }
        ], function (err, result) {
            if (callback) callback(err, result)
        });
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
    receiveAcdpMessage: receiveAcdpMessage,
    handleAcdpRequest: function (externalResponseFunction) {
        externalResponseHandler = externalResponseFunction;
    }
};