'use strict';

// gulp plugins
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

// other libraries
var runSequence = require('run-sequence'),
    del = require('del'),
    glob = require('glob');

// for browserify
var browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream');

// filepaths
var SRC       = './src',
    SPEC      = './spec',
    DIST      = './dist',
    DIST_SPEC = './dist_spec';

var MAIN_JS_FILE_NAME = 'srfi.js',
    MAIN_SPEC_FILE_NAME = 'spec.js';

/*
 * Others
 */
gulp.task('clean:all', function(callback){
  del([DIST, DIST_SPEC], callback);
});

gulp.task('clean:product', function(callback){
  del([DIST], callback);
});

gulp.task('clean:spec', function(callback){
  del([DIST_SPEC], callback);
});

var swallowError = function(error){
  console.log(error.toString());
  this.emit('end');
};

/*
 * JavaScript
 */
function scripts(watch) {
  var files = glob.sync(SRC + '/**/*.js'),
      config = { entries :files,
                 debug: watch, cache: {},
                 packageCache: {}, fullPaths: true },
      bundler = browserify(config),
      rebundle = function() {
        return bundler.bundle().
          on('error', swallowError).
          pipe(source(MAIN_JS_FILE_NAME)).
          pipe(gulp.dest(DIST));
      };

  bundler = watch ? watchify(bundler) : bundler;
  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('browserify', function(){
  return scripts(false);
});

gulp.task('watchify', function(){
  return scripts(true);
});

/*
 * Unit Test
 */
// I really want change to using watchfy. Maybe I will later.
gulp.task('power-assert', function(){
  var testFiles = glob.sync(SPEC + '/**/*.js'),
      bundler = browserify({entries: testFiles, debug: true});

  bundler.transform('espowerify');

  return bundler.bundle().
    on('error', swallowError).
    pipe(source(MAIN_SPEC_FILE_NAME)).
    pipe(gulp.dest(DIST_SPEC));
});

gulp.task('jasmine', function(){
  return gulp.src(DIST_SPEC + '/' + MAIN_SPEC_FILE_NAME).
    pipe($.jasmine()).
    on('error', swallowError);
});

/*
 * Build stuffs
 */
gulp.task('uglify', function(){
  return gulp.src(DIST + '/*.js').
    pipe($.uglify()).
    pipe(gulp.dest(DIST));
});

gulp.task('jshint', function(){
  return gulp.src([SRC + '/**/*.js', SPEC + '/**/*.js']).
    pipe($.jshint()).
    pipe($.jshint.reporter('jshint-stylish'));
});

/*
 * Main tasks
 */
gulp.task('default', ['build']);

gulp.task('build', function(){
  return runSequence(
    'clean:all',
    ['power-assert', 'browserify', 'jshint'],
    'jasmine',
    'uglify');
});

gulp.task('test', function(){
  return runSequence(
    'clean:spec',
    ['power-assert', 'jshint'],
    'jasmine');
});

// gulp.task('watch', ['watchify'], function(){
gulp.task('watch', function(){
  $.watch(SRC+'/**/*.js', function(files, callback){
    runSequence(
      'clean:product',
      ['browserify', 'jshint'],
      'jasmine',
      callback);
  });

  $.watch(SPEC+'/**/*.js', function(files, callback){
    runSequence(
      'clean:spec',
      ['power-assert', 'jshint'],
      'jasmine',
      callback);
  });
});
