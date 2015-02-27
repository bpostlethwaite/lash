'use strict';

var Lash = require('../index');
var test = require('tap').test;

test('Lash timer test', function (t) {

    t.plan(1);
    var s = Lash();

    s.startTimer();

    s.stack(function mockProcessingFunc (next) {
        // here we pretend to be doing some work for 3 seconds.
        setTimeout(function () {
            next(null);
        }, 3000);
    });

    s.stack(function closeStack (err) {
        if (err) return t.fail('should not error');

        var secondsRun = this.time();
        t.equal(Math.round(secondsRun), 3, 'got time from stack');
    });

    s.collapse();
});
