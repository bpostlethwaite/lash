/*
 * Really barebones middleware handler.
 * Functions can pass values to each other.
 * The last argument is always "next" except
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

module.exports = Lash

function Lash (spec) {

    var self = {}
    if (!spec) spec = {}

    Object.keys(spec).forEach( function (key) {
        self[key] = spec[key]
    })

    var steps = []


    function stack (fn) {
        steps.push(fn)
    }

    function collapse () {
        var args = Array.prototype.slice.call(arguments)
          , cb_ = steps.pop()
          , n = 0
          , l = steps.length

        nextStep(cb, args)

        function cb () {
            var args = Array.prototype.slice.call(arguments)
            var er = args.shift()
            if (er)
                return cb_.apply(self, [er].concat(args))
            if (++n === l)
                return cb_.apply(self, [null].concat(args))

            return nextStep(cb, args)
        }

        function nextStep (cb, args) {
            var s = steps[n]

            if (typeof s === "function")
                return s.apply(self, [cb].concat(args))

            else throw new Error("Only functions in chain!: "+s)
        }
    }

    self.stack = stack
    self.collapse = collapse


    return self
}
