var logger = require('../logger.js');
var collector = require('../requestCollector');

var PORT = 42000; // TODO: make configurable with nconf
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

var bindListener = function () {
    client.on('listening', function () {
        var address = client.address();
        logger.info('ACDP Multicast Receiver listening on ' + address.address + ":" + address.port);
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
            var options = {};
            options.realip = remote.address;
            options.receiverType = "multicast";
            collector.receiveAcdpRequest(options, reqObj);
        } catch (e) {
            logger.error(e);
        }
    });
};

module.exports = {
    start: startListen
};