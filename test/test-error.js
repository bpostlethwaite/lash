'use strict';

var Lash = require('../index');
var test = require('tap').test;

test('Lash error handling', function (t) {

    t.plan(2);
    var s = Lash({});

    s.startTimer();

    s.stack(function addreqres (next) {
        var value = this.res + this.req;
        next(null, value);
    });

    s.stack(function produceerror (next) {
        // pass through this step right away with no errors
        // then fire an error 2 seconds after.
        // it should interrupt the stack down the line.
        setTimeout(function () {
            next('this is an error');
        }, 2000);

        next(null);
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

    s.stack(function shouldNotReach () {
        t.fail('should not hit this function');
    });

    s.stack(function closeStack (err) {
        var secondsRun = s.time();
        t.ok(secondsRun, 'stack took '+ secondsRun +' seconds.');

        t.equal(err, 'this is an error');
    });

    s.collapse();
});
