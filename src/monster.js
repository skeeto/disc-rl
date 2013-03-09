/**
 * Exports: Monster, MONSTERS, PLAYER
 */

var MONSTERS = [];

function Monster(x, y, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.name = name || null;
}

Monster.prototype.display = function() {
    TILES.add(this.x, this.y, this.type);
};

Monster.prototype.toString = function() {
    return '[object ' + this.type + ' ' + this.name +
        ' (' + this.x + ', ' + this.y + ')]';
};

Monster.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

Monster.prototype.change = function(dx, dy) {
    var x = this.x + dx;
    var y = this.y + dy;
    if (MAP.isPassable(x, y)) {
        this.move(x, y);
        return true;
    } else {
        return false;
    }
};

/**
 * Perform a melee attack on a target.
 * @param {Monster} target
 */
Monster.prototype.melee = function(target) {
    // XXX
};

/**
 * @returns true if the monster is at x, y.
 */
Monster.prototype.isAt = function(x, y) {
    return this.x === x && this.y === y;
};
