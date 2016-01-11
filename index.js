var multicastListener = require('./listeners/multicast.js');
var unicastListener = require('./listeners/unicast.js');
var mcClient = multicastListener.startListen();
var validator = require('./validators/acdpDraft01.js');
var logger = require('./lib/logger.js');

mcClient.on('message', function (message, remote) {
    console.log('Received message from: ' + remote.address + ':' + remote.port);
        validator.validate(message, function(err, data){
            if (err) {
                logger.error(err);
            } else {
                logger.debug(data)
            }
        })
});