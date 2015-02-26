'use strict';

var Lash = require('../index');
var test = require('tap').test;

test('Lash timer test', function (t) {

    t.plan(2);
    var s = Lash({req:2, res:3});

    s.startTimer();

    s.stack(function addreqres (next) {
        var value = this.res + this.req;
        next(null, value);
    });

    s.stack(function mockProcessingFunc (next, value) {
        // here we pretend to be doing some work for 3
        // seconds. If an err happens during the work,
        // next should be noop.
        setTimeout(function () {

            // things still happen here until
            // next() is called and it goes nowhere.
            value *= 3;

            // should be noop and lead nowhere
            // as previous function errored the stack.
            next(null, value);

        }, 3000);
    });

    s.stack(function closeStack (err, value) {
        var secondsRun = this.time();
        t.ok(secondsRun, 'stack took '+ secondsRun +' seconds.');
        t.equal(value, 15, 'got value from stack, and closed it.');
    });

    s.collapse();
});
