/**
 * Exports: TILES, Tile
 */

/**
 * @constructor
 */
function Tile($tile) {
    this.$tile = $tile;
    this.types = [];
}

Tile.prototype.set = function() {
    if (this.types.length > 0) {
        this.types = [];
        this.$tile.prop('class', 'tile');
    }
    for (var i = 0; i < arguments.length; i++) {
        var type = arguments[i];
        if (type) {
            this.types.push(type);
            this.$tile.addClass(type);
        }
    }
    return this;
};

Tile.prototype.is = function(type) {
    return this.types.indexOf(type) >= 0;
};

Tile.prototype.remove = function(type) {
    if (this.is(type)) {
        this.types = this.types.filter(function(v) {
            return v !== type;
        });
        this.$tile.removeClass(type);
    }
    return this;
};

Tile.prototype.add = function(type) {
    if (!this.is(type)) {
        this.types.push(type);
        this.$tile.addClass(type);
    }
    return this;
};

/** @namespace */
var TILES = {};

/** 2D array of all tiles. */
TILES.grid = [];

/** @const */
TILES.SIZE = 15;

/** @const */
TILES.RADIUS = Math.floor(TILES.SIZE / 2);

/** @const */
TILES.PIXELS = 32;

/* Initialize tiles. */
(function() {
    var $map = $('#map');
    for (var x = 0; x < TILES.SIZE; x++) {
        var row = [];
        TILES.grid.push(row);
        for (var y = 0; y < TILES.SIZE; y++) {
            var $tile = $('<div/>').attr({'class': 'tile'}).css({
                'left': (x * TILES.PIXELS) + 'px',
                'top': (y * TILES.PIXELS) + 'px'
            });
            row.push(new Tile($tile));
            $map.append($tile);
        }
    }
}());

/**
 * Visit each tile with a function.
 * @param f This function is called as f(tile, x, y).
 */
TILES.visit = function(f) {
    for (var y = 0; y < TILES.grid.length; y++) {
        for (var x = 0; x < this.grid[y].length; x++) {
            f(this.grid[x][y],
              FOCUS.x + x - TILES.RADIUS,
              FOCUS.y + y - TILES.RADIUS);
        }
    }
};

/**
 * Set all tiles to a given type.
 * @param [type]
 */
TILES.clear = function(type) {
    this.visit(function(tile) {
        tile.set(type);
    });
};

/* World coordinates. */

/** World display focus. */
var FOCUS = {
    x: 0,
    y: 0,
    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    up: function() {
        this.y--;
        return this;
    },
    down: function() {
        this.y++;
        return this;
    },
    left: function() {
        this.x--;
        return this;
    },
    right: function() {
        this.x++;
        return this;
    },
    on: function(thing) {
        this.x = thing.x;
        this.y = thing.y;
    }
};

TILES.get = function(x, y) {
    if (this.grid[x + TILES.RADIUS - FOCUS.x]) {
        var wx = x + TILES.RADIUS - FOCUS.x;
        var wy = y + TILES.RADIUS - FOCUS.y;
        return this.grid[wx][wy];
    } else {
        return undefined;
    }
};

TILES.set = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.set(type);
    }
    return this;
};

TILES.add = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.add(type);
    }
    return this;
};

TILES.remove = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.remove(type);
    }
    return this;
};
