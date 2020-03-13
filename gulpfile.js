'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

const {watch, series} = require('gulp');

gulp.task('sass', function() {
    return gulp.src('css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css/'));
});

gulp.task('sass-watch', function() {
    watch('css/*.scss', series('sass'));
});

gulp.task('browser-sync', function(done) {
    var files = [
        '*.html',
        'css/*.css',
        'js/*.js',
        'img/img/*.{png, jpg, gif}'
    ];
    browserSync.init(files, {
        server: {
            baseDir: './'
        },
        open: false
        });
    done();
});

gulp.task('default', series('browser-sync', 'sass-watch', function(done){
    done();
}));

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('copyfonts', function(){
    return gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts/'));

    
});

gulp.task('imagemin', function(){
    return gulp.src('./img/img/*.{png, jpg, gif}')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file) {
        return stream
        .pipe(usemin({
            css: [rev()],
            html: [function() {
                return htmlmin({collapseWhitespace: true});
            }],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
        }))
    }))
    .pipe(gulp.dest(['./dist/']))
    
});

gulp.task('build', gulp.series('clean', 'copyfonts', 'imagemin','usemin', function (done){
     done();
 }));