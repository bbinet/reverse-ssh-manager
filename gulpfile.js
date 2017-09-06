var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('del', function(cb) {
  del('rsm/static/**', cb);
});

gulp.task('lint', function() {
  gulp.src(['static/js/*.js'])
    .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('usemin', function() {
  gulp.src('static/index.html')
    .pipe(usemin({
      assetsDir: 'static',
      css: [minifyCss(),rev()],
      js: [uglify(), rev()]
      //js: [uglify({mangle: false}), rev()]
    }))
    .pipe(gulp.dest('rsm/static'));
});

gulp.task('bootstrap-fonts', function() {
  gulp.src('static/vendor/bootstrap/dist/fonts/*')
    .pipe(gulp.dest('rsm/static/fonts'));
});

gulp.task('img', function() {
  gulp.src('static/img/*')
    .pipe(gulp.dest('rsm/static/img'));
});

gulp.task('default', function() {
  runSequence('del', ['usemin', 'img', 'bootstrap-fonts', 'lint']);
});
