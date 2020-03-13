'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');
const {watch, series} = require('gulp');

gulp.task('sass', function(done) {
    return gulp.src('css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css/'));
});

gulp.task('sass-watch', function(done) {
    watch('css/*.scss', gulp.series('sass'));
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

gulp.task('default', gulp.series('browser-sync', 'sass-watch', function(done){
    done();
}));