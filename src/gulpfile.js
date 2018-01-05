'use strict';

var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  rimraf = require('rimraf'),
  imagemin = require('gulp-imagemin'),
  copy = require('gulp-copy'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

//
// Path definitions
//

var paths = {
  assets: './assets',
  webroot: './wwwroot'
};

// Include all images, including subdirectories
paths.imageSrc = paths.assets + '/images/**';
paths.imageDest = paths.webroot + '/images';

paths.scssSrc = paths.assets + '/sass/main.scss';
paths.scssDestDir = paths.webroot + '/css';
paths.scssDestFile = 'main.min.css';

// Include all js, including subdirectories
paths.jsSrc = paths.assets + '/js/**/*.js';
paths.jsDestDir = paths.webroot + '/js';
paths.jsDestFile = 'main.min.js';

// Copy library files
paths.copyLibSrc = [
    'bower_components/jquery/dist/**',
    'bower_components/bootstrap/dist/**',
];
paths.copyLibDest = paths.webroot + '/lib';

// Copy MISC files
paths.copyMiscSrc = [ paths.assets + '/favicon.ico' ];
paths.copyMiscDest = paths.webroot;

//
// Clean up task
//

gulp.task('clean', function (cb) {
  rimraf(paths.webroot, cb);
});

//
// Sass compliation task
//

gulp.task('sass', function () {
  return gulp.src(paths.scssSrc)
    .pipe(sass())
    .pipe(rename(paths.scssDestFile))
    .pipe(gulp.dest(paths.scssDestDir));
});

//
// JS minification task
//

gulp.task('js', function () {
  return gulp.src(paths.jsSrc)
    .pipe(concat(paths.jsDestFile))
    .pipe(uglify())
    .pipe(gulp.dest(paths.jsDestDir));
});

//
// Image minification task
//

gulp.task('images', function() {
  return gulp.src(paths.imageSrc)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest(paths.imageDest))
});

//
// Copy lib files task

gulp.task('copyLib', function () {
    return gulp.src(paths.copyLibSrc, { base: './bower_components/' }) 
        .pipe(gulp.dest(paths.copyLibDest));
});

//
// Copy MISC files task
//

gulp.task('copyMisc', function () {
  return gulp.src(paths.copyMiscSrc)
    .pipe(gulp.dest(paths.copyMiscDest));
});

//
// Watch task
//

gulp.task('watch', function () {
    gulp.watch(paths.copyLibSrc, ['copyLib']);
    gulp.watch(paths.copyMiscSrc, ['copyMisc']);
    gulp.watch(paths.assets + '/sass/**/*.scss', ['sass']);
    gulp.watch(paths.assets + '/js/*.js', ['js']);
    gulp.watch(paths.assets + '/images/*', ['images']);
});

//
// Default task
//

gulp.task('default', function () {
    runSequence('clean', ['sass', 'js', 'images', 'copyLib', 'copyMisc', 'watch']);
});
