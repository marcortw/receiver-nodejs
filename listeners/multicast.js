var PORT = 42000;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');
module.exports = {
    startListen: function(){
        client.on('listening', function () {
            var address = client.address();
            console.log('Multicast Client listening on ' + address.address + ":" + address.port);
            client.setBroadcast(true)
            client.setMulticastTTL(128);
            client.addMembership('230.185.192.108');
        });

        client.on('message', function (message, remote) {
            console.log('A: Epic Command Received. Preparing Relay.');
            console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
        });

        client.bind(PORT);
    }
};


