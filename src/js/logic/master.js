var Enemy = require('../object/enemy');
var Master = function(scene) {
    this.scene = scene;

    this.frame_count = 0;
};

Master.prototype.update = function () {
    this.frame_count++;

    if(this.frame_count % 100 === 0) {
        var x = Math.floor(Math.random() * this.scene.game.width); // x軸はランダム
        var y = 0; // 画面上部から
        this.scene.addObject(new Enemy(this.scene, x, y));
    }
};
module.exports = Master;
