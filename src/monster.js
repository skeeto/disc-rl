/**
 * Exports: Monster
 */

function Monster(x, y, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.name = name || null;
    this.timer = 0;
}

Monster.prototype.display = function() {
    if (world.isVisible(this.x, this.y)) {
        display.add(this.x, this.y, this.type);
    }
};

Monster.prototype.toString = function() {
    return this.name || 'the ' + this.type;
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

Monster.prototype.damage = function(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
        log('%s was derezzed.', this);
        world.remove(this);
        return true;
    }
    return false;
};

/**
 * Random walker.
 */
Monster.prototype.act = function(callback) {
    this.moveBy(R.random(-1, 2), R.random(-1, 2));
    callback();
};

/**
 * Perform a melee attack on a target.
 * @param {Monster} target
 */
Monster.prototype.melee = function(target) {
    var roll = d20();
    var str = bonus(this.strength);
    var tdex = bonus(target.dexterity);
    var damage = Math.max(0, this.weapon() + str);
    var qualifier = ' ';
    if (roll === 20) {
        damage *= 2;
        qualifier = 'critically ';
    }
    if (roll === 20 || roll + str > 10 + tdex + target.armor) {
        log('%s %s hits %s for %d damage.', this, qualifier, target, damage);
        target.damage(damage);
    } else {
        log('%s misses %s.', this, target);
    }
};

/**
 * @returns true if the monster is at x, y.
 */
Monster.prototype.isAt = function(x, y) {
    return this.x === x && this.y === y;
};
