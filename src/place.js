/**
 * Exports: Place, Wall, Floor
 */

/**
 * @constructor
 */
function Place() {
}

Place.prototype.items = [];
Place.prototype.solid = false;
Place.prototype.seen = false;

Place.prototype.toString = function() {
    return 'a ' + this.constructor.name.toLowerCase();
};

/* Types of places. */

function Wall() {
    this.solid = true;
}
Wall.extend(Place);

function Floor() {
}
Floor.extend(Place);
