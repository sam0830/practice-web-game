var Chara = function(scene) {
    this.scene = scene;
    this.game = scene.game;



    this._id = "chara";

    this.x = 0;
    this.y = 0;

    // 経過フレーム数
    this.frame_count = 0;

    // 現在表示するスプライト
    this.current_sprite_index = 0;
};

Chara.prototype.id = function() {
    return this._id;
};

// 更新
Chara.prototype.update = function() {
    this.frame_count++;

    // animation sprite
    if(this.frame_count % this.spriteAnimationSpan() === 0) {
        this.current_sprite_index++;
        if(this.current_sprite_index >= this.spriteIndices().length) {
            this.current_sprite_index = 0;
        }
    }
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
    return this.spriteIndices()[this.current_sprite_index].x;
};

Chara.prototype.spriteIndexY = function() {
    return this.spriteIndices()[this.current_sprite_index].y;
};

Chara.prototype.spriteAnimationSpan = function() {
    return 10;
};

Chara.prototype.spriteIndices = function() {
    return [{x: 0, y: 0}, {x: 1, y: 0}];
};

Chara.prototype.spriteWidth = function() {
    return 105;
};

Chara.prototype.spriteHeight = function() {
    return 200;
};
module.exports = Chara;
