var Chara = require('../object/chara');
var StageScene = function(game) {
    this.game = game;

    // シーン上のオブジェクト一覧
    this.objects = {};

    // 経過フレーム数
    this.frame_count = 0;

    this.addObject(new Chara(this));
}

StageScene.prototype.addObject = function(object) {
    this.objects[object.id()] = object;
}

// 更新
StageScene.prototype.update = function() {
    this.frame_count++;

    this.updateObjects();
};

StageScene.prototype.updateObjects = function() {
    for(var id in this.objects) {
        this.objects[id].update();
    }
}

// 描画
StageScene.prototype.draw = function() {
    this.drawObjects();
};

StageScene.prototype.drawObjects = function() {
    for(var id in this.objects) {
        this.objects[id].draw();
    }
}
module.exports = StageScene;
