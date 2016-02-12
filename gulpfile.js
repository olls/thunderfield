var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    processhtml = require('gulp-processhtml'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    prefix = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber');


gulp.task('css', function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass())
    .pipe(prefix())
    .pipe(cssnano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('css-dev', function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('js', function () {
  return gulp.src([
    'main.js'
  ], {cwd: './src/js/'})
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(processhtml())
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

gulp.task('copy', function () {
  gulp.src('./src/imgs/*')
    .pipe(gulp.dest('./build/imgs/'));
});

gulp.task('reload', function () {
  setTimeout(function () { livereload.changed('/'); }, 1000);
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./src/css/*.scss', ['css-dev']);
  gulp.watch('./src/**/*', ['reload']);
});

gulp.task('default', ['css', 'js', 'html', 'copy']);
