'use strict';
/*
 * Really barebones middleware handler.
 * Functions can pass values to each other.
 * The last argument is always 'next' except
 * for the last middleware in the stack, which
 * handles err as the first arg proceeded by any
 * additional passed in args from the previous func
 * on the stack.
 *
 * You call next(err, arg1, arg2) to move to the
 * next middleware and have the next function called
 * like middlefnc(arg1, arg2, next).
 *
 * (See tests for an example of usage)
 *
 * Ben Postlethwaite
 * Plotly
 * December 2013
 */

function Lash (spec) {

    var self = {};
    if (!spec) spec = {};

    self.startTime = null;

    self.startTimer = function () {
        self.startTime = process.hrtime();
    };

    self.time = function () {
        var stackTime = process.hrtime(self.startTime);
        var numSeconds = stackTime[0] + stackTime[1] / 1e6;
        return numSeconds;
    };

    Object.keys(spec).forEach( function (key) {
        self[key] = spec[key];
    });

    var steps = [];


    function stack (fn) {
        steps.push(fn);
    }

    function collapse () {
        var args = Array.prototype.slice.call(arguments);
        var cb_ = steps.pop();
        var n = 0;
        var l = steps.length;


        function nextStep (cb, args) {
            var s = steps[n];

            if (typeof s === 'function') {
                return s.apply(self, [cb].concat(args));
            } else {
                throw new Error('Only functions in chain!: ' + s);
            }
        }

        var lashNext = function (args) {

            /*
            * If the first argument passed to next() is not `null`,
            * it will be treated as an error, and the stack
            * will skip to the last step and close up shop and
            * no-op the next() function so that the last
            * step will not be fired twice.
            */

            var er = args.shift();

            if (er) {
                lashNext = function () {};
                return cb_.apply(self, [er].concat(args));
            }

            if (++n === l) {
                lashNext = function () {};
                return cb_.apply(self, [null].concat(args));
            }

            return nextStep(next, args);
        };

        function next () {
            var args = Array.prototype.slice.call(arguments);
            lashNext(args);
        }

        nextStep(next, args);

    }

    self.stack = stack;
    self.collapse = collapse;


    return self;
}

module.exports = Lash;
