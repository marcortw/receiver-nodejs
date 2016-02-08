process.env.DEBUG = "acdp-receiver:*";
var acdpreceiver = require('./index');

acdpreceiver.controller.on('validrequest', function (options, acdprequest) {
    console.log('a valid event received in the main program!');
});

acdpreceiver.controller.on('invalidrequest', function (options, acdprequest) {
    console.log('an invalid event received in the main program!');
});

acdpreceiver.respond(function (options, acdprequest, callback) {
    if (options.valid) {
        console.log('We received something to respond to in the main program');
        var resp = {
            "type": "ACDPRESPONSE",
            "receiver": {
                "description": "Shiny custom ACDP Receiver."
            }
        };

        resp.demands = [];

        acdprequest.demands.forEach(function (demand) {
            var demandId;
            if(typeof demand.producer === 'undefined'){
                demandId = demand.consumer.id;
            } else {
                demandId = demand.producer.id;
            }
            resp.demands.push({'id': demandId, 'state': 'RECEIVED'});
            console.log('would respond: ' + JSON.stringify(resp));
        });

        callback(null, resp);
    } else {
        console.log('received an invalid response');
        callback(new Error("we don't accept invalid acdp requests"));
    }

});