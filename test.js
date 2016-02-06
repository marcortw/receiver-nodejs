process.env.DEBUG = "acdp-receiver:*";
var acdpreceiver = require('./index');

//acdpreceiver.respond()

acdpreceiver.controller.on('validrequest', function (options, acdprequest) {
    console.log('a valid event received in the main program!');
});

acdpreceiver.controller.on('invalidrequest', function (options, acdprequest) {
    console.log('an invalid event received in the main program!');
});

acdpreceiver.respond(function (options, acdprequest, callback) {
    console.log('We received something to respond to in the main program');
    var resp = {
        "type": "ACDPRESPONSE",
        "receiver": {
            "description": "Shiny custom ACDP Receiver."
        }
    };

    resp.demands = [];

    acdprequest.demands.forEach(function (item) {
        var demandId = item.producer.id || item.consumer.id;
        resp.demands.push({'id': demandId, 'state': 'RECEIVED'});
    });

    callback(null, resp);

});