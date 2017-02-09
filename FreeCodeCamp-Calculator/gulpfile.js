var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minify = require('gulp-clean-css');
var rename = require('gulp-rename');

// Compile Sass to CSS
gulp.task('sass', function() {
    return gulp.src('sass/main.sass')
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourceMaps.write('../maps/'))
        .pipe(gulp.dest('css/'));
});

// Clone and minify Sass to separate CSS file
gulp.task('clone', function() {
    return gulp.src('sass/main.sass')
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minify({compatibility: 'ie8'}))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(sourceMaps.write('../maps/'))
        .pipe(gulp.dest('css/'));
});

//Watch task
gulp.task('watch', function() {
    gulp.watch('sass/**/*.sass', ['sass', 'clone']);
});