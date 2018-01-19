var Util = require('../util');
var ObjectBase = require('./base');

var Shot = function(scene, x, y) {
    ObjectBase.apply(this, arguments);

    this.x = x;
    this.y = y;
};

Util.inherit(Shot, ObjectBase);

Shot.prototype.spriteName = function() {
    return "shot";
};

Shot.prototype.spriteAnimationSpan = function() {
    return 0;
};

Shot.prototype.spriteIndices = function() {
    return [{x: 0, y: 0}];
};

Shot.prototype.spriteWidth = function() {
    return 210;
};

Shot.prototype.spriteHeight = function() {
    return 391;
};
module.exports = Shot;
