var Game = function(canvas) {
    this.ctx = canvas.getContext('2d'); // Canvas への描画はctxプロパティを通して行う
    // 画面サイズ
    this.height = canvas.height;
    this.width = canvas.width;
};

Game.prototype.startRun = function() {
    this.run();
};

Game.prototype.run = function() {
    // ゲームの処理
    this.request_id = requestAnimationFrame(this.run.bind(this));
}
module.exports = Game;
