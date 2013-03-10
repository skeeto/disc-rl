var controls = {
    enabled: false,
    callback: null
};

$(window).keypress(function(event) {
    if (!controls.enabled) return true;
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
    case '.'.charCodeAt(0):
        /* Wait a turn. */
        moved = true;
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
        controls.callback();
        world.look();
        world.display();
        return false;
    } else {
        return true;
    }
});
