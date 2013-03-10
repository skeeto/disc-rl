/**
 * Exports: World, world
 */

var world = null;

function World(map) {
    this.map = map || Map.empty();
    this.monsters = [];
    this.player = new Player(0, 0);
    this.focus = {
        x: 0,
        y: 0
    };
}

World.prototype.display = function() {
    this.map.display();
    this.monsters.forEach(withThis('display'));
    this.player.display();
};

World.prototype.look = function(x, y) {
    if (y != null) {
        this.focus.x = x;
        this.focus.y = y;
    } if (x) {
        var thing = x;
        this.focus.x = thing.x;
        this.focus.y = thing.y;
    } else {
        this.focus.x = this.player.x;
        this.focus.y = this.player.y;
    }
};

/**
 * @returns the monster at the position.
 */
World.prototype.monsterAt = function(x, y) {
    var monsters = this.monsters.concat([this.player]);
    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].isAt(x, y)) return monsters[i];
    }
    return undefined;
};

/**
 * @returns true if the place is passable by a monster.
 */
World.prototype.isPassable = function(x, y) {
    var place = this.map.get(x, y);
    if (place) {
        if (place.solid || this.monsterAt(x, y)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
