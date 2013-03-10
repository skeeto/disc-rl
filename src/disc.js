/* Test the message log. */
log('Greetings, program.');

var world = new World(Map.random('disc-rl', 24, 24, Wall, Floor, Floor));
world.player.move(0, 1);
world.monsters.push(new Bot(5, 1));

/* Draw a sample display. */
world.look();
world.display();
