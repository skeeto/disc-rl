/**
 * @constructor
 */
function Place() {
    this.type = null;
    this.monster = null;
    this.items = [];
    this.solid = false;
}

Place.prototype.toString = function() {
    return this.type;
};

/**
 * @constructor
 */
function Map(w, h) {
    this.grid = [];
    for (var x = 0; x < w; x++) {
        var row = [];
        this.grid.push(row);
        for (var y = 0; y < h; y++) {
            row.push(new Place());
        }
    }
}

Map.prototype.visit = function(f) {
    for (var x = 0; x < this.grid.length; x++) {
        for (var y = 0; y < this.grid[x].length; y++) {
            f(this.grid[x][y], x, y);
        }
    }
    return this;
};

Map.prototype.get = function(x, y) {
    if (this.grid[x]) {
        return this.grid[x][y];
    } else {
        return undefined;
    }
};

Map.prototype.display = function(x, y) {
    var that = this;
    tiles.visit(function(tile, tx, ty) {
        var place = that.get(x + tx, y + ty);
        var type = place ? place.toString() : null;
        tile.set(type);
    });
};

/* Generators */

Map.random = function(seed, w, h) {
    var rng = new RNG(seed);
    var types = Array.prototype.slice.call(arguments, 3);
    var map = new Map(w, h).visit(function(place) {
        place.type = types[rng.random(types.length)];
    });
    return map;
};

Map.columns = function(w, h) {
    var map = new Map(w, h);
    return map;
};
