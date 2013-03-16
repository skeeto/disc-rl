/* Monster action functions. */

var AI = AI || {};

AI.randomWalk =  function(callback) {
    this.moveBy(R.random(-1, 2), R.random(-1, 2));
    callback();
};

AI.huntMelee = function(callback) {
    var path = [];
    var player = world.player;
    if (!this.awake && this.dist(player) > this.sleepRadius) {
        callback(); /* Do nothing */
        return;
    } else {
        this.awake = true; /* Wake up. */
    }
    var that = this;
    var visible = function(x, y) {
        if (world.isSolid(x, y)) {
            return false;
        } else {
            var dist = Math.max(Math.abs(x - that.x), Math.abs(y - that.y));
            if (dist === 1) {
                return !world.monsterAt(x, y);
            } else {
                return true;
            }
        }
    };
    var astar = new ROT.Path.AStar(player.x, player.y, visible);
    astar.compute(this.x, this.y, function(x, y) {
        path.push({x: x, y: y});
    });
    if (path.length < 2) {
        //debug(100, 'AI.huntMelee: monster is stuck');
    } else if (path.length === 2) {
        this.melee(player);
    } else if (path.length > 2) {
        this.tryMove(path[1].x, path[1].y);
    }
    callback();
};

AI.huntRanged = function(callback) {
    if (world.isVisible(this.x, this.y)) {
        this.ranged(world.player, callback);
    } else {
        AI.huntMelee.call(this, callback);
    }
};

AI.skirmisher = function(callback) {
    var p = world.player;
    var tdist = this.tdist(p);
    if (tdist === 1) {
        this.melee(p);
        return callback();
    } else if (tdist < 3) {
        /* Run away. */
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        dx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        dy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        if (!world.map.get(this.x + dx, this.y + dy).solid) {
            this.move(this.x + dx, this.y + dy);
            return callback();
        } else {
            var other = [];
            if (dx === 0) {
                other.push({x: this.x - 1, y: this.y + dy});
                other.push({x: this.x + 1, y: this.y + dy});
            } else if (dy === 0) {
                other.push({x: this.x + dx, y: this.y - 1});
                other.push({x: this.x + dx, y: this.y + 1});
            } else {
                other.push({x: this.x, y: this.y + dy});
                other.push({x: this.x + dx, y: this.y});
            }
            other = other.randomize();
            for (var i = 0; i < other.length; i++) {
                if (!world.map.get(other[i].x, other[i].y).solid) {
                    this.move(other[i].x, other[i].y);
                    return callback();
                }
            }
            /* Nowhere to run. */
            return AI.huntMelee.call(this, callback);
        }
    } else if (world.isVisible(this.x, this.y)) {
        /* Attack */
        return this.ranged(world.player, callback);
    } else {
        /* Seek */
        return AI.huntMelee.call(this, callback);
    }
};

/* Make the melee hunter the default. */
Monster.prototype.act = AI.huntMelee;
