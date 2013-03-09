function withThis(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(object) {
        return object[f].apply(object, args);
    };
}
