var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify');



gulp.task('css', function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass())
    .pipe(prefix())
    .pipe(cssnano())
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('css-dev', function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('js', function () {
  return gulp.src('main.js', {cwd: './src/js/'})
    .pipe(browserify({
      bare: true,
      debug: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('js-dev', function () {
  return gulp.src([
    'main.js'
  ], {cwd: './src/js/'})
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(browserify({
      bare: true,
      debug: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('html-dev', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('img', function () {
  gulp.src('./node_modules/photoswipe/dist/default-skin/**/*', { base: './node_modules/photoswipe/dist' })
    .pipe(gulp.dest('./build/imgs/'));
  gulp.src('./src/imgs/*')
    .pipe(gulp.dest('./build/imgs/'));
});

gulp.task('reload', function () {
  setTimeout(function () { livereload.changed('/'); }, 1000);
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./src/css/*.scss', ['css-dev']);
  gulp.watch('./src/js/*.js', ['js-dev']);
  gulp.watch('./src/*.html', ['html-dev']);
  gulp.watch('./src/imgs/**/*', ['img']);
  gulp.watch('./src/**/*', ['reload']);
});

gulp.task('dev', ['css-dev', 'js-dev', 'html-dev', 'img']);
gulp.task('default', ['css', 'js', 'html', 'img']);
