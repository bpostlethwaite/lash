'use strict';

var Lash = require('../index');
var test = require('tap').test;

function addreqres (next) {
    var value = this.res + this.req;
    next(null, value);
}

function doublevalue (next, value) {
    value *= 2;
    next(null, value);
}
//
function mockProcessingFunc (next, value) {
    // here we pretend to be doing some work for 5
    // seconds. If an err happens during the work,
    // next should not be called
    setTimeout(function () {
        value *= 3;
        next(null, value);
    },5000);
}

function produceerror (next, value) {
    // we've already passed by this step
    // by the time it errors, let's
    // make sure it closes the stack properly.
    setTimeout(function () {
        next('this is an error');
    }, 2000);

    next(null);
}

test('Lash error handling', function (t) {
    t.plan(1);
    var s = Lash({req:2, res:3});

    s.stack(addreqres);
    s.stack(produceerror);
    s.stack(doublevalue);
    s.stack(mockProcessingFunc);
    s.stack(function shouldNotReach () {
        t.fail('should not his this function');
    });
    s.stack(function closeStack (err, value) {
        t.equal(err, 'this is an error');
        t.end('lash properly bails from rest of stack on err');
    });
    s.collapse();
});
