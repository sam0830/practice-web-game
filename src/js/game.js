var StageScene = require('./scene/stage');
var ImageLoader = require('./asset_loader/image');
var Input = require('./input');

var Game = function(canvas) {
    this.input = new Input();
    this.input.bindKey();

    this.ctx = canvas.getContext('2d'); // Canvas への描画はctxプロパティを通して行う
    // 画面サイズ
    this.height = canvas.height;
    this.width = canvas.width;

    this.scene = {}; // シーン一覧
    this.next_scene = null;
    this.current_scene = null;
    this.prev_scene = null;

    this.addScene("stage", new StageScene(this)); // シーンを追加
    this.changeScene("stage"); // 最初のシーンに切り替え

    this.image_loader = new ImageLoader();
    this.image_loader.loadImage("chara", '../image/chara.png');
    this.image_loader.loadImage("shot", '../image/chara.png');
    this.image_loader.loadImage("enemy", '../image/chara.png');
};

Game.prototype.startRun = function() {
    this.run();
};

Game.prototype.run = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.input.handleGamePad();
    // ゲームの処理
    this.toNextSceneIfExists(); // 次のシーンが前フレームにて予約されていればそちらに切り替え

    this.scene[this.current_scene].update();
    this.scene[this.current_scene].draw();

    this.request_id = requestAnimationFrame(this.run.bind(this));

    // 押下されたキーを保存しておく
    this.input.saveBeforeKey();
};

Game.prototype.toNextSceneIfExists = function() {
    if(!this.next_scene) {
        return;
    }
    this.current_scene = this.next_scene;
    this.next_scene = null;
};

// ゲームで使用するシーンを追加
Game.prototype.addScene = function(name, scene) {
    this.scene[name] = scene;
};

// シーン切り替え
Game.prototype.changeScene = function(name) {
    this.next_scene = name;
};

// 前のシーンに戻る
Game.prototype.changePrevScene = function() {
    if(!this.prev_scene) {
        return;
    }
    this.current_scene = this.prev_scene;
    this.prev_scene = null;
};
module.exports = Game;
