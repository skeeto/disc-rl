var Mdefaults = {
    strength: 10,
    dexterity: 10,
    mind: 10,
    hp: 25,
    mp: 20
};

function M(name, props, c) {
    var m = function(x, y) {
        Monster.call(this, x, y);
        if (c) c.apply(this, Array.prototype.slice.call(arguments, 2));
    };
    m.prototype = Object.create(Monster.prototype);
    m.prototype.type = name.toLowerCase();
    $.extend(m.prototype, Mdefaults, props);
    return (this[name] = m);
}

M('Player', {}, function() {
    this.name = NameGen.compile("sV|Bvs", true).toString();
});

M('Bot', {
    strength: 2,
    dexterity: 2,
    mind: 2,
    hp: 5
});
