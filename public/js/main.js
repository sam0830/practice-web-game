(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ImageLoader = function() {
    this.images = {};

    this.loading_image_num = 0;
    this.loaded_image_num = 0;
};

ImageLoader.prototype.loadImage = function(name, path) {
    var self = this;

    self.loading_image_num++;

    // loadImage終了
    var onload_function = function() {
        self.loaded_image_num++;
    };

    var image = new Image();
    image.src = path;
    image.onload = onload_function;
    this.images[name] = image;
};

// 画像が全て読み込まれたかどうか
ImageLoader.prototype.isAllLoaded = function () {
    return this.loaded_image_num > 0 && this.loaded_image_num === this.loading_image_num;
};

// 画像データの取得
ImageLoader.prototype.getImage = function(name) {
    return this.images[name];
};

// 画像データをメモリから解放
ImageLoader.prototype.remove = function(name) {
    delete this.images[name];
};

module.exports = ImageLoader;

},{}],2:[function(require,module,exports){
var StageScene = require('./scene/stage');
var ImageLoader = require('./asset_loader/image');

var Game = function(canvas) {
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
};

Game.prototype.startRun = function() {
    this.run();
};

Game.prototype.run = function() {
    // ゲームの処理
    this.toNextSceneIfExists(); // 次のシーンが前フレームにて予約されていればそちらに切り替え

    this.scene[this.current_scene].update();
    this.scene[this.current_scene].draw();

    this.request_id = requestAnimationFrame(this.run.bind(this));
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

},{"./asset_loader/image":1,"./scene/stage":5}],3:[function(require,module,exports){
var Game = require('./game');
var mainCanvas = document.getElementById('mainCanvas');
var game = new Game(mainCanvas);
game.startRun();

},{"./game":2}],4:[function(require,module,exports){
var Chara = function(scene) {
    this.scene = scene;
    this.game = scene.game;



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
    var image = this.game.image_loader.getImage(this.spriteName());

    var ctx = this.game.ctx;

    ctx.save();

    // set position
    ctx.translate(this.x, this.y);

    var sprite_width = this.spriteWidth();
    var sprite_height = this.spriteHeight();

    ctx.drawImage(image,
        // sprite position
        sprite_width * this.spriteIndexX(), sprite_height * this.spriteIndexY(),
        // sprite size to get
        sprite_width, sprite_height,
        // adjust left x, up y because of x and y indicate sprite center.
        -sprite_width/2, -sprite_height/2,
        // sprite size to show
        sprite_width, sprite_height
    );

    ctx.restore();
};

Chara.prototype.spriteName = function() {
    return "chara";
};

Chara.prototype.spriteIndexX = function() {
    return 0;
};

Chara.prototype.spriteIndexY = function() {
    return 0;
};

Chara.prototype.spriteWidth = function() {
    return 64;
};

Chara.prototype.spriteHeight = function() {
    return 64;
};
module.exports = Chara;

},{}],5:[function(require,module,exports){
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

},{"../object/chara":4}]},{},[3]);
