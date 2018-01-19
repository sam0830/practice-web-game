var Util = require('../util');
var ObjectBase = require('./base');

var Enemy = function(scene, x, y) {
    ObjectBase.apply(this, arguments);

    this.x = x;
    this.y = y;
};
Util.inherit(Enemy, ObjectBase);

Enemy.prototype.spriteName = function () {
    return "enemy";
};

Enemy.prototype.spriteAnimationSpan = function () {
    return 0;
};

Enemy.prototype.spriteIndices = function () {
    return [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
};

Enemy.prototype.spriteWidth = function() {
    return 105;
};

Enemy.prototype.spriteHeight = function() {
    return 200;
};
module.exports = Enemy;
