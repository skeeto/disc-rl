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

function makeJunk(n) {
    var junk = [];
    for (var i = 0; i < n; i++) {
        junk.push(String.fromCharCode(R.random(33, 1000)));
    }
    return junk.join('');
};

$(document).ready(function() {
    $.fn.corrupt = function() {
        var junk = makeJunk(this.text().length);
        this.empty().append($('<span/>').addClass('corrupt').text(junk));
    };
});
