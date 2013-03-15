/**
 * Exports: Monster
 */

function Monster(x, y, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.timer = 0;
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
    var roll = d20();
    var basemod = bonus(this[base]);
    var tdex = bonus(target.dexterity);
    var damage = this.weapon.damage();
    if (base === 'strength') damage += bonus(this.strength);
    damage = Math.max(0, damage);

    var qualifier = ' ';
    var hits = 'hits';
    var misses = 'misses';
    var name = this.toString();
    if (this.player) {
        name = 'you';
        hits = 'hit';
        misses = 'miss';
    }
    if (roll === 20) {
        damage *= 2;
        qualifier = 'critically ';
    }
    if (roll === 20 || roll + basemod + this.level > 10 + tdex + target.armor) {
        unimportant('%s %s %s %s for %d damage.', name, qualifier, hits,
                    target.player ? 'you': target, damage);
        target.damage(damage);
    } else {
        unimportant('%s %s %s.', this, misses, target.player ? 'you' : target);
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
};

/**
 * @returns true if the monster is at x, y.
 */
Monster.prototype.isAt = function(x, y) {
    return this.x === x && this.y === y;
};
