var controls = {
    enabled: false,
    target: [],
    auto: false,
    selected: null,
    wait: false,
    waitCount: 0
};

$(window).keydown(function (event) {
    var code = null;
    if ([33, 34, 35, 36, 37, 38, 39, 40].indexOf(event.which) != -1) {
        $.event.trigger({ type : 'keypress', which : event.which });
        return false;
    } else {
        return true;
    }
});

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
    case 'c'.charCodeAt(0):
        controls.target = [];
        controls.selected = null;
        controls.auto = false;
        controls.wait = false;
        unimportant('Action canceled.');
        world.display();
        return false;
        break;
    case 13:
        $('#overlay').hide();
        break;
    }

    if (!controls.enabled) {
        return true;
    }

    if (controls.selected) {
        switch (event.which) {
        case 'f'.charCodeAt(0):
            var m = world.monsterAt(controls.selected.x, controls.selected.y);
            if (m) {
                world.player.ranged(m, function() {
                    world.run();
                });
                controls.enabled = false;
                controls.selected = null;
            } else {
                alert('nothing?');
                controls.selected = null;
            }
            return false;
            break;
        case 'h'.charCodeAt(0):
            world.selectNext();
            world.display();
            return false;
            break;
        case 'l'.charCodeAt(0):
            world.selectNext(true);
            world.display();
            return false;
            break;
        default:
            return true;
        }
    }

    var dx = null, dy = null;
    var moved = false;
    switch (event.which) {
    case 'h'.charCodeAt(0):
    case 37:
        dx = -1;
        dy = 0;
        break;
    case 'j'.charCodeAt(0):
    case 40:
        dx = 0;
        dy = 1;
        break;
    case 'k'.charCodeAt(0):
    case 38:
        dx = 0;
        dy = -1;
        break;
    case 'l'.charCodeAt(0):
    case 39:
        dx = 1;
        dy = 0;
        break;
    case 'y'.charCodeAt(0):
    case 36:
        dx = -1;
        dy = -1;
        break;
    case 'u'.charCodeAt(0):
    case 33:
        dx = 1;
        dy = -1;
        break;
    case 'b'.charCodeAt(0):
    case 35:
        dx = -1;
        dy = 1;
        break;
    case 'n'.charCodeAt(0):
    case 34:
        dx = 1;
        dy = 1;
        break;
    case 'f'.charCodeAt(0):
        world.selectNext();
        world.display();
        return false;
        break;
    case '>'.charCodeAt(0):
    case '<'.charCodeAt(0):
        moved = world.useStairs();
        break;
    case 'w'.charCodeAt(0):
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
    case 'W'.charCodeAt(0):
        controls.wait = true;
        controls.waitCount = 0;
        controls.act();
        return false;
    case 'o'.charCodeAt(0):
        controls.auto = true;
        controls.act();
        return false;
    case '.'.charCodeAt(0):
        return controls.goStairs(StairDown);
        break;
    case ','.charCodeAt(0):
        return controls.goStairs(StairUp);
        break;
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
            controls.wait = false;
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
    } else if (controls.wait) {
        monsters = world.visibleMonsters();
        if (monsters.length === 0) {
            if (controls.waitCount++ % 10 === 0) {
                unimportant('Waiting for enemies. Press "c" to cancel.');
            }
            setTimeout(function() {
                world.run();
            }, 0);
        } else {
            controls.wait = false;
            unimportant('You see %s.', monsters[0]);
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

controls.goStairs = function(type) {
    var pos = world.nearest(function(p, x, y) {
        return p.seen && p instanceof type;
    });
    if (pos) {
        controls.goTo(pos.x, pos.y);
        controls.act();
        return true;
    } else {
        log('No buses for that direction are known.');
        return false;
    }
};

controls.display = function() {
    if (this.selected) {
        display.add(this.selected.x, this.selected.y, 'selected');
    }
};
