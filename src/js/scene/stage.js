var StageScene = function(game) {
    this.game = game;

    // 経過フレーム数
    this.frame_count = 0;
}

// 更新
StageScene.prototype.update = function() {
    this.frame_count++;
};

// 描画
StageScene.prototype.draw = function() {

};
module.exports = StageScene;
