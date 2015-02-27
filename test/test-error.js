'use strict';

var Lash = require('../index');
var test = require('tap').test;

test('Lash error handling', function (t) {

    t.plan(1);
    var s = Lash();

    s.stack(function produceerror (next) {
        // pass through this step right away with no errors
        // then fire an error 2 seconds after.
        // it should interrupt the stack down the line.
        setTimeout(function () {
            next('this is an error');
        }, 2000);

        next(null);
    });

    s.stack(function mockProcessingFunc (next) {
        // here we pretend to be doing some work for 3
        // seconds. If an err happens during the work,
        // next should be noop.
        setTimeout(function () {

            // things can still happen here until
            // next() is called and it goes nowhere.

            // should be noop and lead nowhere
            // as previous function errored the stack.
            next(null);

        }, 3000);
    });

    s.stack(function shouldNotReach (next) {
        t.fail('should not hit this function');
        next(null);
    });

    s.stack(function closeStack (err) {
        t.equal(err, 'this is an error');
    });

    s.collapse();
});
