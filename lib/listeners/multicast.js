var logger = require('../logger.js');
var collector = require('../requestCollector');
var config = require('../configloader');

var mcPort = config.get('protocols:multicast:multicastReceiverMode:config:dstPort');
var mcAddr = config.get('protocols:multicast:multicastReceiverMode:config:dstAddr');
var mcTtl = config.get('protocols:multicast:multicastReceiverMode:config:ttl');
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var ipaddr = require('ipaddr.js');

var bindListener = function () {
    client.on('listening', function () {
        var address = client.address();
        logger.info('ACDP Multicast Receiver listening on ' + address.address + ":" + address.port);
        client.setBroadcast(true)
        client.setMulticastTTL(mcTtl);
        client.addMembership(mcAddr);
    });

    client.bind(mcPort);
    return client;
};

var startListen = function () {
    var mcClient = bindListener();
    mcClient.on('message', function (message, remote) {
        logger.debug('Received message from: ' + remote.address + ':' + remote.port);
        try {
            var reqObj = JSON.parse(message);
            var options = {};
            options.realip = ipaddr.process(remote.address);
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