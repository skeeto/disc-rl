function Weapon() {
}

Weapon.prototype.damage = function() { return 0; };

function Disc() {
}
Disc.extend(Weapon);

Disc.prototype.damage = d6;
