var R = new RNG();

var d2 = RNG.roller('1d2');
var d4 = RNG.roller('1d4');
var d6 = RNG.roller('1d6');
var d8 = RNG.roller('1d8');
var d12 = RNG.roller('1d12');
var d20 = RNG.roller('1d20');

function statRoll() {
    var rolls = [d6(), d6(), d6(), d6()];
    return rolls.reduce(function(a, b) { return a + b; },
                        -Math.min.apply(null, rolls));
}
