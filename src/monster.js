/**
 * Exports: Monster, MONSTERS, PLAYER
 */

var MONSTERS = [];

var NAME_DEFAULT = NameGen.compile("sV<i|v>", true);
var NAME_PLAYER = NameGen.compile("sV|Bvs", true);

function Monster(x, y, type, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.type = type || 'bot';
    this.name = name || NAME_DEFAULT.toString();
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
    this.x += dx;
    this.y += dy;
};

/* The player "monster" */

function Player(x, y, name) {
    Monster.call(this, x, y, 'player', name || NAME_PLAYER.toString());
}

Player.prototype = Object.create(Monster.prototype);

var PLAYER = new Player(0, 0, 'player');
