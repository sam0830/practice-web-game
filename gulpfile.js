'use strict';

// ソース元の対象ファイル
var source_file = './src/js/main.js';
// 出力ディレクトリ
var dist_dir = './public/js/';
// アプリファイル
var appjs = './main.js'

// gulp watchで開くhtml
var html_dir = './public';
var html = 'index.html';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var path = require('path');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').create();

// gulp.task('タスク名', function () { 処理})
gulp.task('browserify', function() {
    return browserify(source_file)
        .bundle()
        .on('error', function() {
                // デスクトップ通知
                var error_handle = notify.onError('<%= error.message %>');
                error_handle(err);
                this.emmit('end');
        })
        .pipe(source(appjs))
        .pipe(gulp.dest(dist_dir));
});

gulp.task('reload', function() {
    return browserSync.reload();
});

gulp.task('build', function(callback) {
    return runSequence(
        'browserify',
        'reload',
        callback
    );
});

gulp.task('browser-sync', function() {
    return browserSync.init({
        server: {
            baseDir: html_dir,
            index: html,
        }
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('src/js/**/*.js', ['build']);
});
