var Lash = require("../.")
var test = require("tap").test


test("Stack with no args", function (t) {
    var s = Lash()
    t.end()
})


test("Stack parameter handling", function (t) {

    var s = Lash({req:2, res:3})
    s.stack(addreqres)
    s.stack(doublevalue)
    s.stack(function (err, value) {
        t.equal(err, null)
        t.equal(value, 10)
        t.end()
    })
    s.collapse()
})


test("Lash error handling", function (t) {

    var s = Lash({req:2, res:3})
    s.stack(addreqres)
    s.stack(produceerror)
    s.stack(doublevalue)
    s.stack(function (err, value) {
        t.equal(err, "this is an error")
        t.end()
    })
    s.collapse()
})


function addreqres (next) {
    var value = this.res + this.req

    next(null, value)
}

function doublevalue (next, value) {
    value *= 2

    next(null, value)
}

function produceerror (next, value) {
    next("this is an error")
}
