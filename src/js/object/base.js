var id = 0;

var ObjectBase = function(scene) {
    this.scene = scene;
    this.game = scene.game;

    this._id = ++id;

    this.x = 0;
    this.y = 0;

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
