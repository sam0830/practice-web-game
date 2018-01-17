var Chara = function(scene) {
    this.scene = scene;
    this.game = game;

    this._id = "chara";

    this.x = 0;
    this.y = 0;

    // 経過フレーム数
    this.frame_count = 0;
};

Chara.prototype.id = function() {
    return this._id;
};

// 更新
Chara.prototype.update = function() {
    this.frame_count++;
};

// 描画
Chara.prototype.draw = function() {

};
module.exports = Chara;
