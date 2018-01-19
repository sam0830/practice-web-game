var Util = require('../util');
var ObjectBase = require('./base');

var Chara = function(scene) {
    ObjectBase.apply(this, arguments);
};
Util.inherit(Chara, ObjectBase);

Chara.prototype.spriteName = function() {
    return "chara";
};

Chara.prototype.spriteIndexX = function() {
    return this.spriteIndices()[this.current_sprite_index].x;
};

Chara.prototype.spriteIndexY = function() {
    return this.spriteIndices()[this.current_sprite_index].y;
};

Chara.prototype.spriteAnimationSpan = function() {
    return 10;
};

Chara.prototype.spriteIndices = function() {
    return [{x: 0, y: 0}, {x: 1, y: 0}];
};

Chara.prototype.spriteWidth = function() {
    return 105;
};

Chara.prototype.spriteHeight = function() {
    return 200;
};
module.exports = Chara;
