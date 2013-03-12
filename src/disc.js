(function() {
    if (Save.exists('world')) {
        // XXX Display loading message
        start = Date.now();
        Save.load('world');
        debug(10, 'Loading took %0.3f seconds.', (Date.now() - start) / 1000);
        log('Game restored. Welcome back, %s.', world.player);
    } else {
        log('Greetings, program.');
        important('Navigate with the "hjkl yubn" keys, like nethack.');
        //var world = new World(Map.cellular(120, 120));
        world = new World(Map.dungeon(100, 100));
        var start = world.map.random('solid', false);
        world.player.move(start.x, start.y);
        world.look();
    }
}());

$(window).unload(function() {
    world.save();
});

/* Get things going. */
world.display();
world.run();
