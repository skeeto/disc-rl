var Mindex = {};

Mindex.add = function (type) {
    if (!this[type.prototype.level]) {
        this[type.prototype.level] = [];
    }
    this[type.prototype.level].push(type);
};

Mindex.random = function(level) {
    while (level > 0 && !this[level]) {
        level--;
    }
    return this[Math.max(1, level)].random();
};

var Mdefaults = {
    level: 1,
    strength: 10,
    dexterity: 10,
    mind: 10,
    player: false,
    name: null,
    armor: 0,
    weapon: function() { return d4(); }
};

function M(className, props, constructor) {
    var m = function(x, y) {
        Monster.call(this, x, y);
        if (this.name !== null) {
            this.name = NameGen.compile(this.name).toString();
        }
        if (constructor) {
            constructor.apply(this, Array.prototype.slice.call(arguments, 2));
        }
        this.maxhp = this.strength;
        for (var i = 1; i <= this.level; i++) {
            this.maxhp += d6();
        }
        this.maxmp = this.mind;
        for (i = 1; i <= this.level; i++) {
            this.maxmp += d6();
        }
        this.hp = this.maxhp;
        this.mp = this.maxmp;
    };
    m.prototype = Object.create(Monster.prototype);
    m.prototype.type = className;
    $.extend(m.prototype, Mdefaults, props);
    if (!m.prototype.player) {
        Mindex.add(m);
    }
    return (this[className] = m);
}

M('Player', {
    player: true,
    name: '<sV|Bvs>(.exe)',
    experience: 0
});

Player.prototype.act = function(callback) {
    controls.enabled = true;
    controls.callback = callback;
};

Player.prototype.addExperience = function(exp) {
    this.experience += exp;
    unimportant('You gain %d experience.', exp);
    if (this.experience > this.nextLevel()) {
        this.levelUp();
    }
};

/**
 * Level up the player.
 */
Player.prototype.levelUp = function() {
    this.experience -= this.nextLevel();
    this.level += 1;
    var hproll = d6();
    this.maxhp += hproll;
    this.hp += hproll;
    var mproll = d6();
    this.maxmp += mproll;
    this.mp += mproll;
    if ((this.level % 3) === 0) this.strength++; // XXX
    important("You have reached level %d!", this.level);
};

Player.prototype.nextLevel = function() {
    return Math.ceil(Math.pow(this.level + 5, 2.5));
};

M('Bot', {
    level: 1,
    strength: 2,
    dexterity: 2,
    mind: 2
});

Bot.prototype.act = AI.randomWalk;

M('Script', {
    level: 1,
    strength: 4,
    dexterity: 4,
    mind: 2,
    name: 'id.(sh|bat|js)'
});
