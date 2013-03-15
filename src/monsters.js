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
    weapon: new Disc()
};

Monster.prototype.init = function(args) {
    Monster.apply(this, args);
    if (this.name != null) {
        this.name = NameGen.compile(this.name).toString();
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

function Mextend(constructor, props) {
    constructor.extend(Monster);
    $.extend(constructor.prototype, Mdefaults, props || {});
    if (!constructor.prototype.player) {
        Mindex.add(constructor);
    }
};

/* Level 1 */

function Bit() { this.init(arguments); }
Mextend(Bit, {
    level: 1,
    strength: 2,
    dexterity: 2,
    mind: 2
});
Bit.prototype.act = AI.randomWalk;

function Script() { this.init(arguments); }
Mextend(Script, {
    level: 1,
    strength: 4,
    dexterity: 4,
    mind: 2,
    name: 'id.(sh|bat|js)'
});

/* Level 2 */

function Adware() { this.init(arguments); }
Mextend(Adware, {
    level: 2,
    strength: 6,
    dexterity: 5,
    mind: 4
});

function Spyware() { this.init(arguments); }
Mextend(Spyware, {
    level: 2,
    strength: 3,
    dexterity: 14,
    mind: 8
});

/* Level 3 */

function Byte() { this.init(arguments); }
Mextend(Byte, {
    level: 3,
    strength: 12,
    dexterity: 4,
    mind: 8
});
