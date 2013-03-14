/**
 * Exports: World, world
 */

var WORLD_VERSION = 2;
var DUNGEON_SIZE = 100;

var world = null;

function World(map) {
    this.map = map || Map.empty();
    this.maps = {};
    this.player = new Player(0, 0);
    this.time = 0;
    this.focus = {
        x: 0,
        y: 0
    };
    this.active = true;
    this.lastSave = 0;
    this.version = WORLD_VERSION;
}

World.prototype.display = function() {
    this.map.computeVisible(this.player);
    this.map.display();
    this.map.monsters.forEach(withThis('display'));
    if (this.active) this.player.display();

    /* Stats */
    display.$name.text(this.player.name);
    display.$level.text(this.player.level);
    display.$dlevel.text(this.map.level);
    display.$experience.text(this.player.experience +
                             ' / ' + this.player.nextLevel());
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
    var monsters = this.map.monsters.concat([this.player]);
    for (var i = 0; i < monsters.length; i++) {
        if (monsters[i].isAt(x, y)) return monsters[i];
    }
    return undefined;
};

World.prototype.isSolid = function(x, y) {
    return this.map.isSolid(x, y);
};

/**
 * @returns true if the place is passable by a monster.
 */
World.prototype.isPassable = function(x, y) {
    return !this.isSolid(x, y) && !this.monsterAt(x, y);
};

World.prototype.isVisible = function(x, y) {
    return this.map.isVisible(x, y);
};

World.prototype.spawn = function(type) {
    var p = this.map.random(function(place) { return !place.solid; });
    if (!this.monsterAt(p.x, p.y)) this.map.monsters.push(new type(p.x, p.y));
};

/**
 * Remove a monster from the world.
 * @param {Monster} monster
 */
World.prototype.remove = function(monster) {
    if (monster === this.player) {
        log('You were derezzed.');
        world.gameOver();
    } else {
        log('%s was derezzed.', monster);
        this.map.monsters = this.map.monsters.filter(function(m) {
            return m !== monster;
        });
        var exp = monster.maxhp + Math.max(monster.dexterity, monster.mind);
        this.player.addExperience(exp);
    }
};

/**
 * Run the next world event.
 */
World.prototype.run = function() {
    if (!this.active) return;
    var all = [this.player].concat(this.map.monsters);
    var wait = Math.max(0, all.reduce(function(max, m) {
        return Math.min(max, m.timer);
    }, Infinity));
    var movers = all.filter(function(m) {
        m.timer -= wait;
        return m.timer <= 0;
    });
    world.time += wait;

    if (world.time - world.lastSave > 2000) {
        this.save();
        world.lastSave = world.time;
    }

    while (world.time > this.map.nextspawn) {
        this.map.nextspawn += R.exponential() * this.map.spawnrate *
            Math.max(1, Math.log(this.map.monsters.length));
        // Occasionally spawn higher level monsters
        var mod = Math.floor(R.exponential() * 0.5);
        this.spawn(Mindex.random(this.map.level + mod));
    }

    var mover = movers.pop();
    mover.timer = Math.max(20 - bonus(mover.dexterity), 1);
    mover.act(this.run.bind(this));
};

World.prototype.gameOver = function() {
    this.active = false;
    Save.clear('world');
    this.display();
};

World.prototype.save = function() {
    if (this.active) {
        var start = Date.now();
        Save.save('world');
    }
};

/**
 * Try to load the world from the save.
 */
World.load = function() {
    if (Save.exists('world')) {
        Save.load('world');
        if (world.version !== WORLD_VERSION) {
            world = null;
            return false;
        }
        return true;
    } else {
        return false;
    }
};

/**
 * Use the stairs at the player's location.
 */
World.prototype.useStairs = function() {
    var place = this.map.get(this.player.x, this.player.y);
    if (place instanceof Stair) {
        if (!place.map) {
            var map = Map.dungeon(DUNGEON_SIZE, DUNGEON_SIZE);
            this.maps[map.id] = map;
            place.map = map.id;
            map.level = this.map.level + 1;
            var pos = map.random(function(place) {
                return !(place.solid || place instanceof Stair);
            });
            var up = new StairUp(this.map.id);
            up.x = this.player.x;
            up.y = this.player.y;
            map.set(pos.x, pos.y, up);
            place.x = pos.x;
            place.y = pos.y;
        }
        this.maps[this.map.id] = this.map;
        this.map = this.maps[place.map];
        this.maps[place.map.id] = null;
        this.player.x = place.x;
        this.player.y = place.y;
        this.map.nextspawn = Math.max(this.map.nextspawn, world.time);
        return true;
    } else {
        return false;
    }
};

/**
 * Return a list of monsters currently in view.
 */
World.prototype.visibleMonsters = function() {
    var that = this;
    return this.map.monsters.filter(function(m) {
        return that.map.isVisible(m.x, m.y);
    });
};
