var Util = require('../util');
var ObjectBase = require('./base');
var Constant = require('../constant');
var Shot = require('./shot');

var Chara = function(scene) {
    ObjectBase.apply(this, arguments);
};
Util.inherit(Chara, ObjectBase);

Chara.prototype.update = function() {
    ObjectBase.prototype.update.apply(this, arguments); // 親クラスの run を実行

    // Zが押されていればショット生成
    if(this.game.input.isKeyDown(Constant.BUTTON_Z)) {
        this.scene.addObject(new Shot(this, this.x, this.y));
    }
};

Chara.prototype.spriteName = function() {
    return "chara";
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
