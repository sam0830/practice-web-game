var Util = require('../util');
var ObjectBase = require('./base');
var Constant = require('../constant');
var Shot = require('./shot');

// キャラの移動速度
var SPEED = 2;

// ショットの移動速度
var SHOT_SPEED = 3;
var SHOT_THETA = 270; // 画面前方

var Chara = function(scene) {
    ObjectBase.apply(this, arguments);
};
Util.inherit(Chara, ObjectBase);

Chara.prototype.update = function() {
    ObjectBase.prototype.update.apply(this, arguments); // 親クラスの update を実行

    // 自機移動
    if(this.game.input.isKeyDown(Constant.BUTTON_LEFT)) {
        this.x -= SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_RIGHT)) {
        this.x += SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_DOWN)) {
        this.y += SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_UP)) {
        this.y -= SPEED;
    }
    // 画面外に出させない
    this.forbidOutOfStage();
    // Zが押されていればショット生成
    if(this.game.input.isKeyDown(Constant.BUTTON_Z)) {
        var shot = new Shot(this, this.x, this.y);
        shot.setMove(SHOT_SPEED, SHOT_THETA);
        this.scene.addObject(shot);
    }
};

Chara.prototype.forbidOutOfStage = function() {
    if(this.x < 0) {
        this.x = 0;
    }
    if(this.x > this.game.width) {
        this.x = this.game.width;
    }
    if(this.y < 0) {
        this.y = 0;
    }
    if(this.y > this.game.height) {
        this.y = this.game.height;1+1;
    }
};

Chara.prototype.spriteName = function() {
    return "chara";
};

Chara.prototype.spriteAnimationSpan = function() {
    return 0;
};

Chara.prototype.spriteIndices = function() {
    return [{x: 0, y: 0}, {x: 1, y: 0}];
};

Chara.prototype.spriteWidth = function() {
    return 210;
};

Chara.prototype.spriteHeight = function() {
    return 391;
};
module.exports = Chara;
