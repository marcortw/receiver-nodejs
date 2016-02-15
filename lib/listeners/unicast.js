var validator = require('../acdpDraft01.js');
var collector = require('../requestCollector');
var logger = require('../logger.js');
var express = require('express');
var bodyParser = require('body-parser');
var config = require('../configloader');
var app = express();

var setupApp = function () {

    app.use(bodyParser.json());

    var listener = app.listen(config.get('protocols:unicast:localConfigMode:config:dstPort'), function () {
        logger.info('ACDP Unicast HTTP Receiver listening on ' + listener.address().port);
    });

    app.post('/', function (req, res) {
        logger.debug(req.body);
        var options = {};
        options.realip = req.ip;
        options.receiverType = "unicast";
        options.httpHeaders = req.headers;
        collector.receiveAcdpRequest(options, req.body, function (err, result) {
            if (err) {
                logger.error('Invalid message');
                res.statusCode = 400;
                return res.send(err);
            } else {
                logger.info('received valid message');
                res.statusCode = 200;
                return res.send(result);
            }

        });
    });
};

module.exports = {
    start: setupApp
};