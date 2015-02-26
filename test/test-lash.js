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

test('Stack with no args', function (t) {
    var s = Lash();
    t.end();
});

test('Stack parameter handling', function (t) {
    //t.plan(2);
    var s = Lash({req:2, res:3});
    s.stack(addreqres);
    s.stack(doublevalue);
    s.stack(function (err, value) {
        t.equal(err, null);
        t.equal(value, 10);
        t.end();
    });
    s.collapse();
});
