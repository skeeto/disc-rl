tiles.visit(function(t) {
    t.set(Math.random() < 0.5 ? 'floor' : 'wall');
});
