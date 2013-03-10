/**
 * Exports: Map
 */

/**
 * @constructor
 */
function Map(w, h) {
    this.grid = {};
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            this.grid[[x, y]] = new Place();
        }
    }
    this.visible = {};
}

Map.prototype.get = function(x, y) {
    return this.grid[[x, y]];
};

Map.prototype.set = function(x, y, place) {
    this.grid[[x, y]] = place;
    return this;
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

/**
 * Get a random location where property is a value.
 *
 */
Map.prototype.random = function(property, value) {
    var that = this;
    var ps = Object.keys(this.grid).filter(function(key) {
        return that.grid[key][property] === value;
    }).map(function(key) {
        return key.split(',').map(parseFloat);
    });
    if (ps.length > 0) {
        var p = ps.random();
        return {x: p[0], y: p[1]};
    } else {
        return null;
    }
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
    var map = new Map(w, h);
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            if (x === 0 || x === w - 1 || y === 0 || y === h - 1) {
                map.set(x, y, new types[0]);
            } else {
                map.set(x, y, new types[rng.random(types.length)]);
            }
        }
    }
    return map;
};

Map.dungeon = function(w, h) {
    var gen = new ROT.Map.Digger(w, h);
    var map = new Map(0, 0);
    gen.create(function(x, y, value) {
        map.grid[[x, y]] = value ? new Wall() : new Floor();
    });
    return map;
};

Map.empty = function() {
    new Map(0, 0);
};
