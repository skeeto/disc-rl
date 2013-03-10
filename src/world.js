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
    display.$name.text(this.player.name);
    display.$level.text(this.player.level);
    display.$health.text(this.player.hp + ' / ' + this.player.maxhp);
    display.$mana.text(this.player.mp + ' / ' + this.player.maxmp);
    display.$strength.text(this.player.strength);
    display.$dexterity.text(this.player.dexterity);
    display.$mind.text(this.player.mind);
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

World.prototype.isSolid = function(x, y) {
    var place = this.map.get(x, y);
    return !place || place.solid;
};

/**
 * @returns true if the place is passable by a monster.
 */
World.prototype.isPassable = function(x, y) {
    return !this.isSolid(x, y) && !this.monsterAt(x, y);
};

/**
 * Remove a monster from the world.
 * @param {Monster} monster
 */
World.prototype.remove = function(monster) {
    if (monster === this.player) {
        log('Game over!');
        // XXX handle game over
    } else {
        this.monsters = this.monsters.filter(function(m) {
            return m !== monster;
        });
    }
};

/**
 * Run the next world event.
 */
World.prototype.run = function() {
    var all = [this.player].concat(this.monsters);
    var wait = all.reduce(function(max, m) {
        return Math.max(max, m.timer);
    }, Infinity);
    var movers = all.filter(function(m) {
        m.timer -= wait;
        return m.timer <= 0;
    });

    function go() {
        if (movers.length > 0) {
            var monster = movers.pop();
            monster.timer = Math.max(20 - bonus(monster.dexterity), 1);
            monster.act(go);
        } else {
            world.run();
        }
    }

    go();
};
