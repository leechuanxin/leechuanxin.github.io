var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task('sass', function() {
    gulp.src('sass/*.scss')
    	.pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
		.pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(sourceMaps.write('../maps/'))
        .pipe(rename(function(path) {
        	path.basename += '.min';
        }))
        .pipe(gulp.dest('css/'))
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('sass/*.scss',['sass']);
});