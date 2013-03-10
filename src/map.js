/**
 * Exports: Map
 */

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
    this.visible = {};
}

Map.prototype.visit = function(f) {
    for (var x = 0; x < this.grid.length; x++) {
        for (var y = 0; y < this.grid[x].length; y++) {
            var place = f(this.grid[x][y], x, y);
            if (place) {
                this.grid[x][y] = place;
            }
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

Map.prototype.isSolid = function(x, y) {
    var place = this.get(x, y);
    return !place || place.solid;
};

Map.prototype.markSeen = function(x, y) {
    var place = this.get(x, y);
    if (place) {
        place.seen = true;
    }
};

Map.prototype.computeVisible = function(player) {
    var that = this;
    this.fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
        return !that.isSolid(x, y);
    });
    var r = display.RADIUS;
    that.visible = {};
    this.fov.compute(player.x, player.y, r, function(x, y) {
        that.visible[[x, y]] = true;
        that.markSeen(x, y);
    });
};

Map.prototype.isVisible = function(x, y) {
    return this.visible[[x,y]];
};

Map.prototype.display = function() {
    var that = this;
    display.visit(function(tile, x, y) {
        var place = that.get(x, y);
        var type = place ? place.toString() : null;
        if (that.visible[[x, y]]) {
            tile.set(type);
        } else if (place && place.seen) {
            tile.set('unseen', type);
        } else {
            tile.set();
        }
    });
};

/* Generators */

Map.random = function(seed, w, h) {
    var rng = new RNG(seed);
    var types = Array.prototype.slice.call(arguments, 3);
    var map = new Map(w, h).visit(function(place, x, y) {
        if (x === 0 || x === w - 1 ||
            y === 0 || y === h - 1) {
            return new types[0];
        } else {
            return new types[rng.random(types.length)];
        }
    });
    return map;
};

Map.columns = function(w, h) {
    var map = new Map(w, h);
    return map;
};

Map.empty = function() {
    new Map(0, 0);
};
