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
};

Tile.prototype.is = function(type) {
    return this.types.indexOf(type) >= 0;
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
            f(this[x][y], x - tiles.RADIUS, y - tiles.RADIUS);
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
