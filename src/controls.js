var controls = {
    enabled: false,
    target: [],
    auto: false
};

$(window).keypress(function(event) {
    switch (event.which) {
    case 'Q'.charCodeAt(0):
        if (confirm('Quit this character and re-roll?')) {
            world.gameOver();
            $('#log').empty();
            printHelp();
            World.reset();
            world.display();
            world.run();
        }
        break;
    case 13:
        $('#overlay').hide();
        break;
    }

    if (!controls.enabled) {
        return true;
    }

    var dx = null, dy = null;
    var moved = false;
    switch (event.which) {
    case 'h'.charCodeAt(0):
        dx = -1;
        dy = 0;
        break;
    case 'j'.charCodeAt(0):
        dx = 0;
        dy = 1;
        break;
    case 'k'.charCodeAt(0):
        dx = 0;
        dy = -1;
        break;
    case 'l'.charCodeAt(0):
        dx = 1;
        dy = 0;
        break;
    case 'y'.charCodeAt(0):
        dx = -1;
        dy = -1;
        break;
    case 'u'.charCodeAt(0):
        dx = 1;
        dy = -1;
        break;
    case 'b'.charCodeAt(0):
        dx = -1;
        dy = 1;
        break;
    case 'n'.charCodeAt(0):
        dx = 1;
        dy = 1;
        break;
    case '>'.charCodeAt(0):
    case '<'.charCodeAt(0):
        moved = world.useStairs();
        break;
    case '.'.charCodeAt(0):
        /* Wait a turn. */
        moved = true;
        break;
    case 'H'.charCodeAt(0):
        controls.goStraight(-1, 0);
        break;
    case 'J'.charCodeAt(0):
        controls.goStraight(0, 1);
        break;
    case 'K'.charCodeAt(0):
        controls.goStraight(0, -1);
        break;
    case 'L'.charCodeAt(0):
        controls.goStraight(1, 0);
        break;
    case 'Y'.charCodeAt(0):
        controls.goStraight(-1, -1);
        break;
    case 'U'.charCodeAt(0):
        controls.goStraight(1, -1);
        break;
    case 'B'.charCodeAt(0):
        controls.goStraight(-1, 1);
        break;
    case 'N'.charCodeAt(0):
        controls.goStraight(1, 1);
        break;
    case 'o'.charCodeAt(0):
        controls.auto = true;
        controls.act();
        return false;
    }
    if (dx != null && dy != null) {
        var p = world.player;
        var tx = p.x + dx;
        var ty = p.y + dy;
        var target = world.monsterAt(tx, ty);
        if (target) {
            p.melee(target);
            moved = true;
        } else if (!world.isSolid(tx, ty)) {
            p.move(tx, ty);
            moved = true;
        }
    }
    if (moved) {
        controls.enabled = false;
        world.run();
        return false;
    } else {
        return true;
    }
});


controls.act = function() {
    world.look();
    world.display();
    if (controls.target.length > 0) {
        var monsters = world.visibleMonsters();
        if (monsters.length > 0) {
            unimportant('You see %s.', monsters[0]);
            controls.target = [];
            controls.auto = false;
            controls.enabled = true;
            return;
        }
        var next = controls.target.pop();
        world.player.move(next.x, next.y);
        setTimeout(function() {
            world.run();
        }, 10);
    } else if (controls.auto) {
        if (controls.autoexplore()) {
            controls.act();
        } else {
            controls.auto = false;
        }
    } else {
        controls.enabled = true;
    }
};

controls.goStraight = function(dx, dy) {
    var path = [];
    var p = {x: world.player.x + dx, y: world.player.y + dy};
    while (!world.isSolid(p.x, p.y)) {
        path.push({x: p.x, y: p.y});
        p.x += dx;
        p.y += dy;
    }
    controls.target = path.reverse();
    controls.act();
};

controls.goTo = function(x, y) {
    var passable = function(x, y) {
        return !world.isSolid(x, y);
    };
    var astar = new ROT.Path.AStar(x, y, passable);
    var path = [];
    astar.compute(world.player.x, world.player.y, function(x, y) {
        path.push({x: x, y: y});
    });
    controls.target = path.reverse();
    controls.target.pop();
};

controls.autoexplore = function() {
    var pos = world.nearest(function(p, x, y) {
        return !p.seen && !p.solid;
    });
    if (pos == null) {
        log('Entire map has been explored.');
        return false;
    } else {
        controls.goTo(pos.x, pos.y);
        return true;
    }
};
