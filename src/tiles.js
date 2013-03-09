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
var tiles = [];

/** @const */
tiles.SIZE = 15;

/** @const */
tiles.RADIUS = Math.floor(tiles.SIZE / 2);

/** @const */
tiles.TILESIZE = 32;

/* Initialize tiles. */
(function() {
    var $map = $('#map');
    for (var x = 0; x < tiles.SIZE; x++) {
        var row = [];
        tiles.push(row);
        for (var y = 0; y < tiles.SIZE; y++) {
            var $tile = $('<div/>').attr({'class': 'tile'}).css({
                'left': (x * tiles.TILESIZE) + 'px',
                'top': (y * tiles.TILESIZE) + 'px'
            });
            row.push(new Tile($tile));
            $map.append($tile);
        }
    }
}());

/**
 * Visit each tiles with a function.
 * @param f This function is called as f(tile, x, y).
 */
tiles.visit = function(f) {
    for (var y = 0; y < tiles.length; y++) {
        for (var x = 0; x < tiles[y].length; x++) {
            f(this[x][y],
              F.x + x - tiles.RADIUS,
              F.y + y - tiles.RADIUS);
        }
    }
};

/**
 * Set all tiles to a given type.
 * @param [type]
 */
tiles.clear = function(type) {
    this.visit(function(tile) {
        tile.set(type);
    });
};

/* World coordinates. */

/** World display focus. */
var F = {
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
    }
};

tiles.get = function(x, y) {
    if (this[x + tiles.RADIUS - F.x]) {
        return this[x + tiles.RADIUS - F.x][y + tiles.RADIUS - F.y];
    } else {
        return undefined;
    }
};

tiles.set = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.set(type);
    }
    return this;
};

tiles.add = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.add(type);
    }
    return this;
};

tiles.remove = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.remove(type);
    }
    return this;
};
