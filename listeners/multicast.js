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
            client.addMembership('239.255.255.242');
        });

        client.bind(PORT);
        return client;
    }
};


