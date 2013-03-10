/* Test the message log. */
log('Greetings, program.');

var world = new World(Map.random('disc-rl', 24, 24, Wall, Floor, Floor));
(function() {
    var start = world.map.random('solid', false);
    world.player.move(start.x, start.y);
    for (var i = 0; i < 4; i++) {
        world.spawn(Script);
    }
}());

/* Draw a sample display. */
world.look();
world.display();
world.run();
