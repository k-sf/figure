var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    rimraf = require('rimraf');

var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        css: 'css/',
    },
    src: {
        style: 'sass/**/*.scss',
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        style: 'sass/*.*',
        style2: 'sass/**/*.*',
    },
};

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});


gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('build', [
    'style:build',
]);

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('browser-sync',['build'], function () {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [historyApiFallback({})]
        }
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.style2], function(event, cb) {
        gulp.start('style:build');
    });
});


gulp.task('default', ['browser-sync']);