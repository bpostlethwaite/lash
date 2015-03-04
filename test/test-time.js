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

        var milliSecondsRun = this.time();
        t.equal(Math.floor(milliSecondsRun / 1e3) , 3, 'got time from stack');
    });

    s.collapse();
});

test('Lash multiple named timer test', function (t) {

    t.plan(2);
    var s = Lash();

    s.startTimer('total');

    s.stack(function mockProcessingFunc (next) {
        // here we pretend to be doing some work for 1 second.
        setTimeout(function () {
            next(null);
        }, 1000);
    });

    s.stack(function mockProcessingFunc2 (next) {
        var self = this;
        this.startTimer('subTimer');
        // here we pretend to be doing some work for 2 seconds.
        setTimeout(function () {
            var milliSecondsRun = self.time('subTimer');
            t.equal(Math.floor(milliSecondsRun / 1e3) , 1, 'got time from subTimer');
            next(null);
        }, 1000);
    });

    s.stack(function closeStack (err) {
        if (err) return t.fail('should not error');

        var milliSecondsRun = this.time('total');
        t.equal(Math.floor(milliSecondsRun / 1e3) , 2, 'got time from stack');
    });

    s.collapse();
});


test('Lash multiple named timer test', function (t) {

    t.plan(1);
    var s = Lash();

    s.stack(function mockProcessingFunc (next) {
        // here we pretend to be doing some work for 1 second.
        setTimeout(function () {
            next(null);
        }, 1000);
    });

    s.stack(function closeStack (err) {
        if (err) return t.fail('should not error');

        t.throws(function () { this.time('notaValidTimer');},
                 TypeError("Cannot read property 'time' of undefined"),
                 'expected error throws when timer dosent exist');

    });

    s.collapse();
});
