var NAME_DEFAULT = NameGen.compile("sV<i|v>", true);

function Monster(x, y, type, name) {
    this.x = x || 0;
    this.y = y || 0;
    this.type = type || 'bot';
    this.name = name || NAME_DEFAULT.toString();
}

Monster.prototype.display = function() {
    tiles.add(this.x, this.y, this.type);
};

Monster.prototype.toString = function() {
    return '[object ' + this.type + ' ' + this.name +
        ' (' + this.x + ', ' + this.y + ')]';
};
