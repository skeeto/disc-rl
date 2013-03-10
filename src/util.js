function withThis(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(object) {
        return object[f].apply(object, args);
    };
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
