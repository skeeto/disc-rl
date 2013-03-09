log('Greetings, program.');

var map = Map.random('disc-rl', 24, 24, 'wall', 'floor', 'floor');
var monsters = [];
var player = new Monster(0, 1, 'player');

monsters.push(new Monster(5, 1, 'bot'));

function display() {
    map.display();
    monsters.map(withThis('display'));
    player.display();
}
