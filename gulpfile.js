var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	jshint = require('gulp-jshint');

gulp.task('lint', function() {
	gulp.src('static/**/*.js').pipe(jshint())
})

gulp.task('develop', function() {
	var stream = nodemon({
		script	: 'server/app.js',
		ext		: 'html js css',
		ignore	: [ 'ignored.js' ],
		tasks	: [ 'lint' ]
	});

	stream.on('restart', function() {
		console.log('restarted!');
	}).on('crash', function() {
		console.error('Application has crashed!\n');
		stream.emit('restart', 2);
	});
});
gulp.task('default',['develop']);