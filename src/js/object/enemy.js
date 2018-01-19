var Util = require('../util');
var ObjectBase = require('./base');

var Enemy = function(scene, x, y) {
    ObjectBase.apply(this, arguments);

    this.scene = scene;

    this.x = x;
    this.y = y;

    this.speed = 3;
};
Util.inherit(Enemy, ObjectBase);

Enemy.prototype.update = function () {
    ObjectBase.prototype.update.apply(this, arguments); // 親クラスの update を実行

    if(this.frame_count % 60 === 0) {
        this. theta = this.setAimTo(this.scene.objects[1].x, this.scene.objects[1].y);
    }
};

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
    return 210;
};

Enemy.prototype.spriteHeight = function() {
    return 391;
};
module.exports = Enemy;
