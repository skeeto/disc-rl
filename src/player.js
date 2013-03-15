function Player() {
    this.strength = statRoll();
    this.dexterity = statRoll();
    this.mind = statRoll();
    this.init(arguments);
}
Mextend(Player, {
    player: true,
    name: '<sV|Bvs>(.exe)',
    experience: 0
});

Player.prototype.act = function(callback) {
    controls.act();
};

Player.prototype.addExperience = function(exp) {
    this.experience += exp;
    unimportant('You gain %d experience.', exp);
    while (this.experience > this.nextLevel()) {
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
    this.hp = this.maxhp;
    var mproll = d6();
    this.maxmp += mproll;
    this.mp += mproll;
    if ((this.level % 3) === 0) this.strength++; // XXX
    important("You have reached level %d!", this.level);
};

Player.prototype.nextLevel = function() {
    return Math.ceil(Math.pow(this.level + 5, 2.5));
};
