var Mdefaults = {
    level: 1,
    strength: 10,
    dexterity: 10,
    mind: 10,
    maxmp: 20,
    armor: 0,
    weapon: function() { return d4(); }
};

function M(name, props, c) {
    var m = function(x, y) {
        Monster.call(this, x, y);
        if (c) c.apply(this, Array.prototype.slice.call(arguments, 2));
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
    m.prototype.type = name.toLowerCase();
    $.extend(m.prototype, Mdefaults, props);
    return (this[name] = m);
}

M('Player', {}, function() {
    this.name = NameGen.compile("sV|Bvs", true).toString();
});

Player.prototype.act = function(callback) {
    controls.enabled = true;
    controls.callback = callback;
};

M('Bot', {
    strength: 2,
    dexterity: 2,
    mind: 2,
    hp: 5
});
