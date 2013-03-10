/*
Copyright (c) 2012-now(), Ondrej Zara
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 * Neither the name of Ondrej Zara nor the names of its contributors may be used
   to endorse or promote products derived from this software without specific
   prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.

IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = function(parent) {
        this.prototype = Object.create(parent.prototype);
        this.prototype.constructor = this;
        return this;
};

var ROT = ROT || {};

ROT.DIRS = {
    "4": [
        [ 0, -1],
        [ 1,  0],
        [ 0,  1],
        [-1,  0]
    ],
    "8": [
        [ 0, -1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
        [ 0,  1],
        [-1,  1],
        [-1,  0],
        [-1, -1]
    ],
    "6": [
        [-1, -1],
        [ 1, -1],
        [ 2,  0],
        [ 1,  1],
        [-1,  1],
        [-2,  0]
    ]
};

/**
 * @class Abstract FOV algorithm
 * @param {function} lightPassesCallback Does the light pass through x,y?
 * @param {object} [options]
 * @param {int} [options.topology=8] 4/6/8
 */
ROT.FOV = function(lightPassesCallback, options) {
    this._lightPasses = lightPassesCallback;
    this._options = {
        topology: 8
    };
    for (var p in options) { this._options[p] = options[p]; }
};

/**
 * Compute visibility
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.prototype.compute = function(x, y, R, callback) {};

/**
 * Return all neighbors in a concentric ring
 * @param {int} cx center-x
 * @param {int} cy center-y
 * @param {int} r range
 */
ROT.FOV.prototype._getCircle = function(cx, cy, r) {
    var result = [];
    var dirs, countFactor, startOffset;

    switch (this._options.topology) {
    case 4:
        countFactor = 1;
        startOffset = [0, 1];
        dirs = [
            ROT.DIRS[8][7],
            ROT.DIRS[8][1],
            ROT.DIRS[8][3],
            ROT.DIRS[8][5]
        ];
        break;

    case 6:
        dirs = ROT.DIRS[6];
        countFactor = 1;
        startOffset = [-1, 1];
        break;

    case 8:
        dirs = ROT.DIRS[4];
        countFactor = 2;
        startOffset = [-1, 1];
        break;
    }

    /* starting neighbor */
    var x = cx + startOffset[0]*r;
    var y = cy + startOffset[1]*r;

    /* circle */
    for (var i=0;i<dirs.length;i++) {
        for (var j=0;j<r*countFactor;j++) {
            result.push([x, y]);
            x += dirs[i][0];
            y += dirs[i][1];

        }
    }

    return result;
};

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.PreciseShadowcasting = function(lightPassesCallback, options) {
    ROT.FOV.call(this, lightPassesCallback, options);
};
ROT.FOV.PreciseShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.PreciseShadowcasting.prototype.compute = function(x, y, R, callback) {
    /* this place is always visible */
    callback(x, y, 0, 1);

    /* standing in a dark place. FIXME is this a good idea?  */
    if (!this._lightPasses(x, y)) { return; }

    /* list of all shadows */
    var SHADOWS = [];

    var cx, cy, blocks, A1, A2, visibility;

    /* analyze surrounding cells in concentric rings, starting from the center */
    for (var r=1; r<=R; r++) {
        var neighbors = this._getCircle(x, y, r);
        var neighborCount = neighbors.length;

        for (var i=0;i<neighborCount;i++) {
            cx = neighbors[i][0];
            cy = neighbors[i][1];
            /* shift half-an-angle backwards to maintain consistency of 0-th cells */
            A1 = [i ? 2*i-1 : 2*neighborCount-1, 2*neighborCount];
            A2 = [2*i+1, 2*neighborCount];

            blocks = !this._lightPasses(cx, cy);
            visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
            if (visibility) { callback(cx, cy, r, visibility); }

            if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) { return; } /* cutoff? */

        } /* for all cells in this ring */
    } /* for all rings */
};

/**
 * @param {int[2]} A1 arc start
 * @param {int[2]} A2 arc end
 * @param {bool} blocks Does current arc block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._checkVisibility = function(A1, A2, blocks, SHADOWS) {
    if (A1[0] > A2[0]) { /* split into two sub-arcs */
        var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
        var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
        return (v1+v2)/2;
    }

    /* index1: first shadow >= A1 */
    var index1 = 0, edge1 = false;
    while (index1 < SHADOWS.length) {
        var old = SHADOWS[index1];
        var diff = old[0]*A1[1] - A1[0]*old[1];
        if (diff >= 0) { /* old >= A1 */
            if (diff == 0 && !(index1 % 2)) { edge1 = true; }
            break;
        }
        index1++;
    }

    /* index2: last shadow <= A2 */
    var index2 = SHADOWS.length, edge2 = false;
    while (index2--) {
        old = SHADOWS[index2];
        diff = A2[0]*old[1] - old[0]*A2[1];
        if (diff >= 0) { /* old <= A2 */
            if (diff == 0 && (index2 % 2)) { edge2 = true; }
            break;
        }
    }

    var visible = true;
    if (index1 == index2 && (edge1 || edge2)) {  /* subset of existing shadow, one of the edges match */
        visible = false;
    } else if (edge1 && edge2 && index1+1==index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
        visible = false;
    } else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
        visible = false;
    }

    if (!visible) { return 0; } /* fast case: not visible */

    var visibleLength, P;

    /* compute the length of visible arc, adjust list of shadows (if blocking) */
    var remove = index2-index1+1;
    if (remove % 2) {
        if (index1 % 2) { /* first edge within existing shadow, second outside */
            P = SHADOWS[index1];
            visibleLength = (A2[0]*P[1] - P[0]*A2[1]) / (P[1] * A2[1]);
            if (blocks) { SHADOWS.splice(index1, remove, A2); }
        } else { /* second edge within existing shadow, first outside */
            P = SHADOWS[index2];
            visibleLength = (P[0]*A1[1] - A1[0]*P[1]) / (A1[1] * P[1]);
            if (blocks) { SHADOWS.splice(index1, remove, A1); }
        }
    } else {
        if (index1 % 2) { /* both edges within existing shadows */
            var P1 = SHADOWS[index1];
            var P2 = SHADOWS[index2];
            visibleLength = (P2[0]*P1[1] - P1[0]*P2[1]) / (P1[1] * P2[1]);
            if (blocks) { SHADOWS.splice(index1, remove); }
        } else { /* both edges outside existing shadows */
            if (blocks) { SHADOWS.splice(index1, remove, A1, A2); }
            return 1; /* whole arc visible! */
        }
    }

    var arcLength = (A2[0]*A1[1] - A1[0]*A2[1]) / (A1[1] * A2[1]);

    return visibleLength/arcLength;
};
