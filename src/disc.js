var SIZE = 15;
var TILESIZE = 32;

var $map = $('#map');

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

/* Initialize tiles. */
var tiles = [];
(function() {
    for (var x = 0; x < SIZE; x++) {
        var row = [];
        tiles.push(row);
        for (var y = 0; y < SIZE; y++) {
            var $tile = $('<div/>').attr({'class': 'tile'}).css({
                'left': (x * TILESIZE) + 'px',
                'top': (y * TILESIZE) + 'px'
            });
            row.push(new Tile($tile));
            $map.append($tile);
        }
    }
}());

/**
 * Clear all tiles.
 * @param [type] The type to set all tiles to.
 */
function clear(type) {
    for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
            tiles[x][y].set(type);
        }
    }
}

clear('floor');
