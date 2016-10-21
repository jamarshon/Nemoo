var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
gulp.task('default', function () {
  return gulp.src('views/components/production/*.ejs')
    .pipe(templateCache({
    	transformUrl: function(url) {
		    return '/views/' + url;
			},
			standalone: true
    }))
    .pipe(gulp.dest('public/production/javascripts'));
});