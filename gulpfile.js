'use strict';

var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ejs = require('gulp-ejs');

var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var bcd = './bower_components'; // Bower Components Directory

gulp.task('default', ['compileWatch', 'browserSync']);

// Clean
var cleaned = false;
gulp.task('clean', function(cb) {
	if (!cleaned) {
		console.log('cleaning...');
		del(['./public/**']).then(function() {
			cleaned = true;
			console.log('cleaned!');
		}).then(cb);
	}
});

// Copy bower components
gulp.task('bowerComponents', ['clean'], function() {
	return gulp.src([bcd + '/angular/angular.min.js'], {
			base: bcd
		})
		.pipe(gulp.dest('./public/lib'));
});

// Compile Ejs templates
gulp.task('compileIndex', ['clean'], function() {
	return gulp.src('./source/index.ejs')
		.pipe(ejs(null, {
			ext: '.html'
		}))
		.pipe(gulp.dest('./public'));
});

// Compile Javascripts: Concat files and mini/Uglify
gulp.task('compileJavascripts', ['clean'], function() {
	return gulp.src(['./source/js/**/app.*.js', // order is important
			'./source/js/**/service.*.js',
			'./source/js/**/filter.*.js',
			'./source/js/**/directive.*.js',
			'./source/js/**/controller.*.js'
		])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./public/js'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'));
});
gulp.task('compile', ['bowerComponents', 'compileIndex', 'compileJavascripts']);

gulp.task('compileWatch', ['compile'], function() {
	gulp.watch(['./source/js/**/*.js'], ['compileJavascripts']);
	gulp.watch(['./source/index.ejs'], ['compileIndex']);
});

// Combine browser sync with nodemon to detect any changes in code
gulp.task('browserSync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000", //match port with app listen
		files: ["public/**/*.*"], // Reload browser sync on any file change in public
		browser: "google chrome", // use chrome as the default browser
		port: 7000,
	});
});
// Nodemon will detect any changes to app.js and rerun server to apply changes
gulp.task('nodemon', function(cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function() {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			console.log("Start nodemon.");
			cb();
			started = true;
		}
	});
});