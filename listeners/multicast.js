var logger = require('../lib/logger.js');
var collector = require('../lib/requestCollector');

var PORT = 42000;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var bindListener = function () {
    client.on('listening', function () {
        var address = client.address();
        logger.info('Multicast Client listening on ' + address.address + ":" + address.port);
        client.setBroadcast(true)
        client.setMulticastTTL(128);
        client.addMembership('239.255.255.242');
    });

    client.bind(PORT);
    return client;
};

var startListen = function () {
    var mcClient = bindListener();
    mcClient.on('message', function (message, remote) {
        logger.debug('Received message from: ' + remote.address + ':' + remote.port);
        try {
            var reqObj = JSON.parse(message);
            collector.receiveAcdpRequest(options, reqObj);
        } catch (e) {
            logger.error(e);
        }
    });
};

module.exports = {
    start: startListen
};