var SIZE = 15;
var TILESIZE = 32;

var $log = $('#log');
var $map = $('#map');

function log(message) {
    $log.append($('<span/>').attr({'class': 'message'}).text(message));
}

/* Initialize tiles. */
var tiles = [];
(function() {
    for (var x = 0; x < SIZE; x++) {
        var row = [];
        tiles.push(row);
        for (var y = 0; y < SIZE; y++) {
            var tile = $('<div/>').attr({'class': 'tile'}).css({
                'left': (x * TILESIZE) + 'px',
                'top': (y * TILESIZE) + 'px'
            });
            row.push(tile);
            $map.append(tile);
        }
    }
}());

/**
 * Clear all tiles.
 * @param [type] The type to set all tiles to.
 */
function clear(type) {
    var reset = 'tile';
    if (type) {
        reset += ' ' + type;
    }
    for (var y = 0; y < SIZE; y++) {
        for (var x = 0; x < SIZE; x++) {
            tiles[x][y].prop('class', reset);
        }
    }
}

function set(x, y, type) {
    tiles[x][y].prop('class', 'tile ' + type);
}

clear('floor');
