var Constant = require('./constant');

var Input = function() {
    // キー押下フラグ
    this.keyflag = 0x0;

    // 1つ前のフレームで押されたキー
    this.before_keyflag = 0x0;
};

// キー押下
Input.prototype.handleKeyDown = function(e) {
    this.keyflag |= this._keyCodeToBitCode(e.keyCode);
    e.preventDefault();
};

// キー押下解除
Input.prototype.handleKeyUp = function(e) {
    this.keyflag &= ~this._keyCodeToBitCode(e.keyCode);console.log(e);
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
    this.keyflag = 0x0;
};
module.exports = Input;
