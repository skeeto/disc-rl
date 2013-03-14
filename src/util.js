function withThis(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(object) {
        return object[f].apply(object, args);
    };
}

function complement(f) {
    return function() {
        return !f.apply(this, arguments);
    }.bind(this);
}

/**
 * Capitalize the first character of the string.
 */
function capitalize(string) {
    return string.replace(/^./, function(c) {
        return c.toUpperCase();
    });
};

/**
 * Compute the modifier from a stat.
 */
function bonus(stat) {
    return (stat - 10) / 2;
}

/**
 * Generate a random ID.
 */
function makeId() {
    return Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
}
