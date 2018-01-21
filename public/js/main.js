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
var Constant = {
    BUTTON_SHIFT: 0x01, // 0b00000001
    BUTTON_SPACE: 0x02, // 0b00000010
    BUTTON_LEFT: 0x04,  // 0b00000100
    BUTTON_UP: 0x08,    // 0b00001000
    BUTTON_RIGHT: 0x10, // 0b00010000 16
    BUTTON_DOWN: 0x20,  // 0b00100000 32
    BUTTON_Z: 0x40,     // 0b01000000
    BUTTON_X: 0x80      // 0b10000000
};
module.exports = Constant;

},{}],3:[function(require,module,exports){
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

},{"./asset_loader/image":1,"./input":4,"./scene/stage":11}],4:[function(require,module,exports){
var Constant = require('./constant');

var Input = function() {
    // キー押下フラグ
    this.keyflag = 0x0;

    // 1つ前のフレームで押されたキー
    this.before_keyflag = 0x0;
};

Input.prototype.handleGamePad = function() {
    var pads = navigator.getGamepads();
    var pad = pads[0]; // 1Pコン

    if(!pad) { return;}

    this.keyflag = 0x00;
    this.keyflag |= pad.buttons[0].pressed ? Constant.BUTTON_Z:0x00;
    this.keyflag |= pad.buttons[1].pressed ? Constant.BUTTON_X:0x00;

    this.keyflag |= pad.axes[1] < -0.5 ? Constant.Button_UP:0x00;
    this.keyflag |= pad.axes[1] > 0.5 ? Constant.BUTTON_DOWN:0x00;
    this.keyflag |= pad.axes[0] < -0.5 ? Constant.BUTTON_LEFT:0x00;
    this.keyflag |= pad.axes[0] > 0.5 ? Constant.BUTTON_RIGHT:0x00;
};

// キー押下
Input.prototype.handleKeyDown = function(e) {
    this.keyflag |= this._keyCodeToBitCode(e.keyCode);
    e.preventDefault();
};

// キー押下解除
Input.prototype.handleKeyUp = function(e) {
    this.keyflag &= ~this._keyCodeToBitCode(e.keyCode);
};

// 指定のキーが押下状態か確認する
Input.prototype.isKeyDown = function(flag) {
    return this.keyflag & flag;
};

// 指定のキーが押下されたか確認する
Input.prototype.isKeyPush = function(flag) {
    // 1フレーム前に押下されておらず、現フレームで押下されているなら true
    return !(this.before_keyflag & flag) && this.keyflag & flag;
};

// キーコードをBitに変換
Input.prototype._keyCodeToBitCode = function(keyCode) {
    var flag;
    switch(keyCode) {
        case 16: // Shift
            flag = Constant.BUTTON_SHIFT;
            break;
        case 32: // space
            flag = Constant.BUTTON_SPACE;
            break;
        case 37: // left
            flag = Constant.BUTTON_LEFT;
            break;
        case 38: // up
            flag = Constant.BUTTON_UP;
            break;
        case 39: // right
            flag = Constant.BUTTON_RIGHT;
            break;
        case 40: // down
            flag = Constant.BUTTON_DOWN;
            break;
        case 88: // x
            flag = Constant.BUTTON_X;
            break;
        case 90: // z
            flag = Constant.BUTTON_Z;
            break;
    }
    return flag;
};

Input.prototype.bindKey = function() {
    var self = this;
    window.onkeydown = function(e) {
        self.handleKeyDown(e);
    };
    window.onkeyup = function(e) {
        self.handleKeyUp(e);
    };
};

Input.prototype.saveBeforeKey = function() {
    this.before_keyflag = this.keyflag;
};
module.exports = Input;

},{"./constant":2}],5:[function(require,module,exports){
var Enemy = require('../object/enemy');
var Master = function(scene) {
    this.scene = scene;

    this.frame_count = 0;
    //this.scene.addObject(new Enemy(this.scene, 100, 100));
};

Master.prototype.update = function () {
    this.frame_count++;

    // if(this.frame_count % 100 === 0) {
    //     var x = Math.floor(Math.random() * this.scene.game.width); // x軸はランダム
    //     var y = 0; // 画面上部から
    //     this.scene.addObject(new Enemy(this.scene, x, y));
    // }
};
module.exports = Master;

},{"../object/enemy":9}],6:[function(require,module,exports){
var Game = require('./game');
var mainCanvas = document.getElementById('mainCanvas');
var game = new Game(mainCanvas);
game.startRun();

},{"./game":3}],7:[function(require,module,exports){
var Util = require('../util');

var id = 0;

var ObjectBase = function(scene) {
    this.scene = scene;
    this.game = scene.game;

    this._id = ++id;

    this.x = 0;
    this.y = 0;

    this.speed = 0;
    this.theta = 0;

    // 経過フレーム数
    this.frame_count = 0;

    // 現在表示するスプライト
    this.current_sprite_index = 0;
};

ObjectBase.prototype.id = function() {
    return this._id;
};

// 更新
ObjectBase.prototype.update = function() {
    this.frame_count++;

    // animation sprite
    if(this.frame_count % this.spriteAnimationSpan() === 0) {
        this.current_sprite_index++;
        if(this.current_sprite_index >= this.spriteIndices().length) {
            this.current_sprite_index = 0;
        }
    }

    this.move();
};

ObjectBase.prototype.move = function() {
    if(this.speed === 0) {
        return;
    }

    var x = Util.calcMoveX(this.speed, this.theta);
    var y = Util.calcMoveY(this.speed, this.theta);
    this.x += x;
    this.y += y;
};

ObjectBase.prototype.setMove = function(speed, theta) {
    this.speed = speed;
    this.theta = theta;
};

ObjectBase.prototype.setAimTo = function (x, y) {
    var ax = x - this.x;
    var ay = y - this.y;

    var theta = Util.radianToTheta(Math.atan2(ay, ax));
    return theta;
};

ObjectBase.prototype.collisionRadius = function() {
    return 0;
};

ObjectBase.prototype.checkCollisionByCircle = function(obj) {
    // x^2 + y^2 = (r1 + r2)^2
    if((this.x - obj.x)**2 + (this.y - obj.y)**2 <= (this.collisionRadius() + obj.collisionRadius())**2) {
        return true;
    }
    return false;
};

ObjectBase.prototype.collisionWidth = function() {
    return 0;
};

ObjectBase.prototype.collisionHeight = function() {
    return 0;
};

ObjectBase.prototype.checkCollisionByRect = function(obj) {
    if(Math.abs(this.x - obj.x) < this.collisionWidth()/2 + obj.collisionWidth()/2 &&
       Math.abs(this.y - obj.y) < this.collisionHeight()/2 + obj.collisionHeight()/2) {
        return true;
    }
    return false;
};

// 描画
ObjectBase.prototype.draw = function() {
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

ObjectBase.prototype.spriteName = function() {
    throw new Error("must be implemented");
};

ObjectBase.prototype.spriteIndexX = function() {
    return this.spriteIndices()[this.current_sprite_index].x;
};

ObjectBase.prototype.spriteIndexY = function() {
    return this.spriteIndices()[this.current_sprite_index].y;
};

ObjectBase.prototype.spriteAnimationSpan = function() {
    throw new Error("must be implemented");
};

ObjectBase.prototype.spriteIndices = function() {
    throw new Error("must be implemented");
};

ObjectBase.prototype.spriteWidth = function() {
    throw new Error("must be implemented");
};

ObjectBase.prototype.spriteHeight = function() {
    throw new Error("must be implemented");
};
module.exports = ObjectBase;

},{"../util":12}],8:[function(require,module,exports){
var Util = require('../util');
var ObjectBase = require('./base');
var Constant = require('../constant');
var Shot = require('./shot');

// キャラの移動速度
var SPEED = 7;

// ショットの移動速度
var SHOT_SPEED = 3;
var SHOT_THETA = 270; // 画面前方

var Chara = function(scene) {
    ObjectBase.apply(this, arguments);
};
Util.inherit(Chara, ObjectBase);

Chara.prototype.update = function() {
    ObjectBase.prototype.update.apply(this, arguments); // 親クラスの update を実行
    var xMove = this.x;
    var yMove = this.y;
    this.speed = 0;
    // 自機移動
    if(this.game.input.isKeyDown(Constant.BUTTON_LEFT)) {
        // this.x -= SPEED;
        xMove -= SPEED;
        this.speed = SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_RIGHT)) {
        // this.x += SPEED;
        xMove += SPEED;
        this.speed = SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_DOWN)) {
        // this.y += SPEED;
        yMove += SPEED;
        this.speed = SPEED;
    }
    if(this.game.input.isKeyDown(Constant.BUTTON_UP)) {
        yMove -= SPEED;
        this.speed = SPEED;
    }

    this.theta = this.setAimTo(xMove, yMove);
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

},{"../constant":2,"../util":12,"./base":7,"./shot":10}],9:[function(require,module,exports){
var Util = require('../util');
var ObjectBase = require('./base');

var Enemy = function(scene, x, y) {
    ObjectBase.apply(this, arguments);

    this.scene = scene;

    this.x = x;
    this.y = y;

    this.speed = 3;
};
Util.inherit(Enemy, ObjectBase);

Enemy.prototype.update = function () {
    ObjectBase.prototype.update.apply(this, arguments); // 親クラスの update を実行

    if(this.frame_count % 60 === 0) {
        this. theta = this.setAimTo(this.scene.objects[1].x, this.scene.objects[1].y);
    }
};

Enemy.prototype.spriteName = function () {
    return "enemy";
};

Enemy.prototype.spriteAnimationSpan = function () {
    return 0;
};

Enemy.prototype.spriteIndices = function () {
    return [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}];
};

Enemy.prototype.spriteWidth = function() {
    return 210;
};

Enemy.prototype.spriteHeight = function() {
    return 391;
};
module.exports = Enemy;

},{"../util":12,"./base":7}],10:[function(require,module,exports){
var Util = require('../util');
var ObjectBase = require('./base');

var Shot = function(scene, x, y) {
    ObjectBase.apply(this, arguments);

    this.x = x;
    this.y = y;
};

Util.inherit(Shot, ObjectBase);

Shot.prototype.spriteName = function() {
    return "shot";
};

Shot.prototype.spriteAnimationSpan = function() {
    return 0;
};

Shot.prototype.spriteIndices = function() {
    return [{x: 0, y: 0}];
};

Shot.prototype.spriteWidth = function() {
    return 210;
};

Shot.prototype.spriteHeight = function() {
    return 391;
};
module.exports = Shot;

},{"../util":12,"./base":7}],11:[function(require,module,exports){
var Chara = require('../object/chara');
var Master = require('../logic/master');
var StageScene = function(game) {
    this.game = game;

    // シーン上のオブジェクト一覧
    this.objects = {};

    // 経過フレーム数
    this.frame_count = 0;

    this.addObject(new Chara(this));

    this.master = new Master(this);
}

StageScene.prototype.addObject = function(object) {
    this.objects[object.id()] = object;
}

// 更新
StageScene.prototype.update = function() {
    this.frame_count++;

    this.updateObjects();

    this.master.update(); // 敵の出現
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

},{"../logic/master":5,"../object/chara":8}],12:[function(require,module,exports){
'use strict';

var Util = function() {};

Util.inherit = function(child, parent) {
    var getPrototype = function(p) {
        if(Object.create) {
            return Object.create(p);
        }

        var F = function() {};
        F.prototype = p;
        return new F();
    };
    child.prototype = getPrototype(parent.prototype);
    child.prototype.constructor = child;
};

Util.thetaToRadian = function(theta) {
    return theta * Math.PI / 180;
};

Util.radianToTheta = function(radian) {
    return (radian * 180 /Math.PI) | 0;
};

Util.calcMoveX = function(speed, theta) {
    return speed * Math.cos(Util.thetaToRadian(theta));
};

Util.calcMoveY = function(speed, theta) {
    return speed * Math.sin(Util.thetaToRadian(theta));
};
module.exports = Util;

},{}]},{},[6]);
