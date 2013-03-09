/* Test the message log. */
log('Greetings, program.');

var PLAYER = new Player(0, 0, 'player');

/* Generate a sample map. */
MAP = Map.random('disc-rl', 24, 24, Wall, Floor, Floor);
PLAYER.move(0, 1);
MONSTERS.push(new Bot(5, 1));

/**
 * Update the entire game display.
 */
function display() {
    MAP.display();
    MONSTERS.map(withThis('display'));
    PLAYER.display();
}

/* Draw a sample display. */
FOCUS.on(PLAYER);
display();
