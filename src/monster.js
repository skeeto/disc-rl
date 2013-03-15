/**
 * Exports: Monster
 */

function Monster(x, y, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.timer = 0;
    this.thrown = false;
}

Monster.prototype.display = function() {
    if (world.isVisible(this.x, this.y)) {
        display.add(this.x, this.y, this.constructor.name);
    }
};

Monster.prototype.toString = function() {
    return this.name || 'the ' + this.constructor.name.toLowerCase();
};

Monster.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

Monster.prototype.moveBy = function(dx, dy) {
    var x = this.x + dx;
    var y = this.y + dy;
    if (world.isPassable(x, y)) {
        this.move(x, y);
        return true;
    } else {
        return false;
    }
};

Monster.prototype.tryMove = function(x, y) {
    return this.moveBy(x - this.x, y - this.y);
};

Monster.prototype.damage = function(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
        world.remove(this);
        return true;
    }
    return false;
};

Monster.prototype.act = function(callback) {
    // Do nothing
    callback();
};

/**
 * Perform an attack on a target.
 * @param {Monster} target
 */
Monster.prototype.attack = function(target, base) {
    var place = world.map.get(this.x, this.y);
    var tplace = world.map.get(target.x, target.y);

    if (this.player && place.corrupted) {
        unimportant('You notice that standing in corruption is making you ' +
                    'less effective in combat.');
    }

    var roll = d20();
    var basemod = bonus(this[base] + place.modify(base));
    var tdex = bonus(target.dexterity + tplace.modify('dexterity'));
    var damage = this.weapon.damage() + place.modify('damage');
    if (base === 'strength') {
        damage += bonus(this.strength + place.modify('strength'));
    }
    damage = Math.max(0, damage);

    var qualifier = ' ';
    if (roll === 20) {
        damage *= 2;
        qualifier = 'critically ';
    }

    var attack = roll + basemod + this.level + place.modify('hit');
    var ac = 10 + tdex + target.armor + tplace.modify('ac') +
            (target.thrown ? 0 : 2);
    if (roll === 20 || attack > ac) {
        if (this.player) {
            unimportant('You %shit %s for %d damage.',
                        qualifier, target, damage);
        } else if (target.player) {
            unimportant('%s %shits you for %d damage.',
                        this, qualifier, damage);
        } else {
            unimportant('%s %shits %s for %d damage.',
                        this, qualifier, target, damage);
        }
        target.damage(damage);
    } else {
        if (this.player) {
            unimportant('You %smiss %s.', qualifier, target);
        } else if (target.player) {
            unimportant('%s %smisses you.', this, qualifier);
        } else {
            unimportant('%s %smisses %s.', this, qualifier, target);
        }
    }
};

Monster.prototype.melee = function(target) {
    this.attack(target, 'strength');
};

Monster.prototype.ranged = function(target) {
    if (this.player) {
        unimportant('You throw your disc at %s!', target);
    } else if (target.player) {
        unimportant('%s throws its disc at you!', this);
    } else {
        unimportant('%s throws its disc at %s!', this, target);
    }
    this.attack(target, 'dexterity');
    this.thrown = true;
};

/**
 * @returns true if the monster is at x, y.
 */
Monster.prototype.isAt = function(x, y) {
    return this.x === x && this.y === y;
};

Monster.prototype.dist = function(m, y) {
    var dx = m.x - this.x;
    var dy = m.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Tile distance (steps to travel).
 */
Monster.prototype.tdist = function(p) {
    return Math.max(Math.abs(p.x - this.x), Math.abs(p.y - this.y));
};
