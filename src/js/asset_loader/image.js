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
