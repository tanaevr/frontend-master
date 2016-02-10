'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    prod: {
        html: 'prod/',
        js: 'prod/js/',
        css: 'prod/css/',
        img: 'prod/img/',
        fonts: 'prod/fonts/'
    },
    dev: {
        html: 'dev/*.html',
        js: 'dev/js/main.js',
        style: 'dev/style/main.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: {
        html: 'dev/**/*.html',
        js: 'dev/js/**/*.js',
        style: 'dev/style/**/*.scss',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*',
        components: 'dev/components/**/*.*'
    },
    clean: './prod'
};

var config = {
    server: {
        baseDir: "./prod"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_master"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:prod', function () {
    gulp.dev(path.dev.html) 
        .pipe(rigger())
        .pipe(gulp.dest(path.prod.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:prod', function () {
    gulp.dev(path.dev.js) 
        .pipe(rigger()) 
        .pipe(sourcemaps.init()) 
        // .pipe(uglify()) 
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.prod.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:prod', function () {
    gulp.dev(path.dev.style) 
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['dev/style/'],
            // outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        // .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.prod.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:prod', function () {
    gulp.dev(path.dev.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.prod.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:prod', function() {
    gulp.dev(path.dev.fonts)
        .pipe(gulp.dest(path.prod.fonts))
});

gulp.task('prod', [
    'html:prod',
    'js:prod',
    'style:prod',
    'fonts:prod',
    'image:prod'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:prod');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:prod');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:prod');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:prod');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:prod');
    });
    watch([path.watch.components], function(event, cb) {
        gulp.start('style:prod');
        gulp.start('js:prod');
		gulp.start('image:prod');
		gulp.start('html:prod');
		gulp.start('fonts:prod');
    });
});


gulp.task('default', ['prod', 'webserver', 'watch']);