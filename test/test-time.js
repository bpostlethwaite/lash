'use strict';

var Lash = require('../index');
var test = require('tap').test;

test('Lash timer test', function (t) {

    t.plan(1);
    var s = Lash();

    s.startTimer('total');

    setTimeout(function () {
        var milliSecondsRun = s.time('total');
        t.equal(Math.floor(milliSecondsRun / 1e3) , 3, 'got time from stack');
    }, 3000);

});

test('Lash multiple named timer test', function (t) {

    t.plan(2);
    var s = Lash();
    s.startTimer('total');
    s.startTimer('subTimer');

    setTimeout(function () {
        var totalTime = s.time('total');
        t.equal(Math.floor(totalTime / 1e3) , 1, 'got time from total timer');

        var subTime = s.time('subTimer');
        t.equal(Math.floor(subTime / 1e3) , 1, 'got time from subTimer');
    }, 1000);

});


test('Lash timer error test', function (t) {

    t.plan(3);
    var s = Lash();

    // try calling startTimer() without a timerId
    t.throws(function () { s.startTimer();},
             Error('timerId must be a string'),
             'expected error throws when no timerId provided');

    // try calling startTimer() without a timerId
    t.throws(function () { s.time();},
             Error('timerId must be a string'),
             'expected error throws when no timerId provided');

    // try getting time from a timer that dosent exist
    t.throws(function () { s.time('notaValidTimer');},
             Error('timer notaValidTimer does not exist'),
             'expected error throws when timer dosent exist');
});
