/* Test the message log. */
log('Greetings, program.');

/* Generate a sample map. */
MAP = Map.random('disc-rl', 24, 24, 'wall', 'floor', 'floor');
PLAYER.move(0, 1);
MONSTERS.push(new Monster(5, 1, 'bot'));

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
