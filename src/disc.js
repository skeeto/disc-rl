var serializer = new Hydrate();

function save() {
    localStorage.save = serializer.stringify(world);
}

function load() {
    world = serializer.parse(localStorage.save);
}

/* Test the message log. */
log('Greetings, program.');
important('Navigate with the "hjkl yubn" keys, like nethack.');

//var world = new World(Map.random('disc-rl', 24, 24, Wall, Floor, Floor));
var world = new World(Map.dungeon(100, 100));
(function() {
    var start = world.map.random('solid', false);
    world.player.move(start.x, start.y);
}());

/* Draw a sample display. */
world.look();
world.display();
world.run();
