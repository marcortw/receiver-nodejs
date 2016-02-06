var validator = require('../validators/acdpDraft01.js');
var collector = require('../lib/requestCollector');
var logger = require('../lib/logger.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var setupApp = function () {

    app.use(bodyParser.json());

    var listener = app.listen(42000, function () {
        logger.info('Unicast HTTP Client listening on ' + listener.address().port);
    });


    //app.get('/', function (req, res) {
    //    res.json(quotes);
    //});

    app.post('/', function (req, res) {
        logger.debug(req.body);
        var options = {realip: req.ip}; // TODO: check X-Forwarded-For header
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