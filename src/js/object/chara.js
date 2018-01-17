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
