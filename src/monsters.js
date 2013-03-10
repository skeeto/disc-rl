var Mindex = {};

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
    if (!m.prototype.player) Mindex[m.prototype.level] = m;
    return (this[className] = m);
}

M('Player', {
    player: true,
    name: '<sV|Bvs>(.exe)'
});

Player.prototype.act = function(callback) {
    controls.enabled = true;
    controls.callback = callback;
};

M('Bot', {
    level: 1,
    strength: 2,
    dexterity: 2,
    mind: 2
});

M('Script', {
    level: 1,
    strength: 2,
    dexterity: 2,
    mind: 2,
    name: 'id.(sh|bat|js)'
});
