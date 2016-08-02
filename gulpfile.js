'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ejs = require('gulp-ejs');
var ngConfig = require('gulp-ng-config');

var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var build = (process.env.NODE_ENV || 'Debug').trim();
var config = require('./config.json')[build];
config.build = build;
console.log('Building ' + config.build + ' Environment');
config.version = require('./package.json').version;
config.bowerFiles = require('./config.json').bowerFiles;
config.jsFiles = [];
config.cssFiles = [];

var bcd = function(filepath) {
	return './bower_components' + (filepath || '');
};
var lib = function(filepath) {
	return 'lib' + (filepath || '');
};

gulp.task('default', [config.build]);

gulp.task('Debug', function(cb) {
	Array.prototype.push.apply(config.jsFiles, config.bowerFiles['js'].map(lib));
	Array.prototype.push.apply(config.cssFiles, config.bowerFiles['css'].map(lib));
	config.jsFiles.push('js/app.js');
	config.jsFiles.push('js/config.js');
	runSequence('clean', ['bowerComponents', 'compile', 'watch'], 'browserSync', cb);
});

// Clean
gulp.task('clean', function(cb) {
	return del(['./public']);
});

// Copy bower components
gulp.task('bowerComponents', function() {
	var components = [];
	for (var filetype in config.bowerFiles) {
		components = components.concat(config.bowerFiles[filetype]);
	}
	return gulp.src(components.map(bcd), {
			base: bcd()
		})
		.pipe(gulp.dest('./public/lib'));
});

gulp.task('compile', ['compileIndex', 'compileJavascripts', 'compileConfig']);

// Compile Index page
gulp.task('compileIndex', function() {
	return gulp.src('./source/index.ejs')
		.pipe(ejs(config, {
			ext: '.html'
		}))
		.pipe(gulp.dest('./public'));
});

// Compile Javascripts: Concat files
gulp.task('compileJavascripts', ['clean'], function() {
	return gulp.src(['./source/js/**/app.*.js', // order is important
			'./source/js/**/service.*.js',
			'./source/js/**/filter.*.js',
			'./source/js/**/directive.*.js',
			'./source/js/**/controller.*.js'
		])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./public/js'));
});

// Compile config file for angular
gulp.task('compileConfig', function() {
	return gulp.src('./config.json')
		.pipe(ngConfig('neat', {
			createModule: false,
			environment: config.build,
		}))
		.pipe(gulp.dest('./public/js'));
});

// set Watch
gulp.task('watch', ['compile'], function() {
	gulp.watch(['./source/js/**/*.js'], ['compileJavascripts']);
	gulp.watch(['./source/index.ejs'], ['compileIndex']);
});

// Set application port
var port = 5000;

// Combine browser sync with nodemon to detect any changes in code
gulp.task('browserSync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:" + port, //match port with app listen
		files: ["public/**/*.*"], // Reload browser sync on any file change in public
		browser: "google chrome", // use chrome as the default browser
		port: 7000, 
	});
});
// Nodemon will detect any changes to app.js and rerun server to apply changes
gulp.task('nodemon', function(cb) {
	var started = false;
	return nodemon({
		script: 'app.js',
		env: {
			PORT: port
		}
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