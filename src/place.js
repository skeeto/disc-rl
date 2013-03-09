/**
 * Exports: Place, Wall, Floor
 */

/**
 * @constructor
 */
function Place(type) {
    this.type = type;
    this.items = [];
    this.solid = false;
}

Place.prototype.toString = function() {
    return this.type;
};

/* Types of places. */

function Wall() {
    Place.call(this, 'wall');
    this.solid = true;
}
Wall.prototype = Object.create(Place.prototype);

function Floor() {
    Place.call(this, 'floor');
}
Floor.prototype = Object.create(Place.prototype);
