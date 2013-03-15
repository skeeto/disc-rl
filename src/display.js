/**
 * Exports: Tile, display
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
var display = {};

/** 2D array of all tiles. */
display.grid = [];

/** @const */
display.SIZE = 15;

/** @const */
display.RADIUS = Math.floor(display.SIZE / 2);

/** @const */
display.PIXELS = 32;

/* Initialize tiles. */
(function() {
    var $map = $('#map');
    for (var x = 0; x < display.SIZE; x++) {
        var row = [];
        display.grid.push(row);
        for (var y = 0; y < display.SIZE; y++) {
            var $tile = $('<div/>').attr({'class': 'tile'}).css({
                'left': (x * display.PIXELS) + 'px',
                'top': (y * display.PIXELS) + 'px'
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
display.visit = function(f) {
    for (var y = 0; y < display.grid.length; y++) {
        for (var x = 0; x < this.grid[y].length; x++) {
            f(this.grid[x][y],
              world.focus.x + x - display.RADIUS,
              world.focus.y + y - display.RADIUS);
        }
    }
};

/**
 * Set all tiles to a given type.
 * @param [type]
 */
display.clear = function(type) {
    this.visit(function(tile) {
        tile.set(type);
    });
};

/* World coordinates. */

display.get = function(x, y) {
    if (this.grid[x + display.RADIUS - world.focus.x]) {
        var wx = x + display.RADIUS - world.focus.x;
        var wy = y + display.RADIUS - world.focus.y;
        return this.grid[wx][wy];
    } else {
        return undefined;
    }
};

display.set = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.set(type);
    }
    return this;
};

display.add = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.add(type);
    }
    return this;
};

display.remove = function(x, y, type) {
    var tile = this.get(x, y);
    if (tile) {
        tile.remove(type);
    }
    return this;
};

display.minimap = $('#minimap').get(0).getContext('2d');

/* Stats components. */
display.$name = $('#name');
display.$level = $('#level');
display.$dlevel = $('#dlevel');
display.$experience = $('#experience');
display.$health = $('#health');
display.$mana = $('#mana');
display.$strength = $('#strength');
display.$dexterity = $('#dexterity');
display.$mind = $('#mind');
display.$disc = $('#disc');

display.throwDisc = function(source, dest, callback) {
    var complete = function() {
        this.$disc.hide();
        if (callback) {
            callback();
        }
    }.bind(this);
    var h2 = this.$disc.height() / 2;
    var a = this.get(source.x, source.y).$tile.position();
    var b = this.get(dest.x, dest.y).$tile.position();
    this.$disc.css({
        top: (a.top + h2) + 'px',
        left: (a.left + h2) + 'px'
    });
    this.$disc.show();
    this.$disc.animate({
        top: (b.top + h2) + 'px',
        left: (b.left + h2) + 'px'
    }, 200, 'linear', complete);
};
