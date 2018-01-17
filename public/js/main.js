(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var StageScene = require('./scene/stage')

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

},{"./scene/stage":3}],2:[function(require,module,exports){
var Game = require('./game');
var mainCanvas = document.getElementById('mainCanvas');
var game = new Game(mainCanvas);
game.startRun();

},{"./game":1}],3:[function(require,module,exports){
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

},{}]},{},[2]);
