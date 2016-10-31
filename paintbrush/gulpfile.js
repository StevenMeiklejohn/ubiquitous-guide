var gulp = require('gulp'),
	concat = require('gulp-concat'),
	minifyCss = require('gulp-minify-css'),
	ngAnnotate = require('gulp-ng-annotate'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	changed = require('gulp-changed'),
	aglio = require('aglio'),
	fs = require('fs'),
	map = require('map-stream');


//
// Util methods for building an angular web app
//

var pathInfo = function (path) {
	var parts = path.split('/'),
		file = parts[parts.length - 1 ],
		dir = parts.join('/').replace(file, '');

	return {
		file: file,
		dir: dir
	}
};

var rename = function (oldFile, newFile) {
	return map(function (file, cb) {

		// note: may get called multiple times with same args if glob contains multiple files
		try {
			fs.renameSync(oldFile, newFile);
		}
		catch (e) {}

		cb(null, file);

	})
};

var cleanFull = function (app) {
	return del([
		app + '/**',
		'!' + app + '/build.json',
		'!' + app
	])
};

var clean = function (app) {
	var conf = require('./' + app + '/build.json');

	var excludeFiles = ['!' + app + '/build.json'];
	var excludeFolders = ['!' + app, '!' + app + '/src', '!' + app + '/src/dist'];

	for (var key in conf) {
		if (key === 'src-files') {
			excludeFolders = excludeFolders.concat(conf[key].map(function(path) {
				return '!' + app + path;
			}))
		}
		else if (key.indexOf('src-') === 0 && Array.isArray(conf[key])) {
			conf[key].forEach(function(path) {
				var parts = path.split('/');
				var folder = '!' + app + parts.slice(0, parts.length - 1).join('/');

				for (var i = 1; i < parts.length; i++) {
					var _folder = '!' + app + parts.slice(0, i).join('/');

					if (excludeFolders.indexOf(_folder) < 0) {
						excludeFolders.push(_folder);
					}
				}

				excludeFiles = excludeFiles.concat([
					'!' + app + path,
					folder + '/*.htm',
					folder + '/*.css'
				]);
			});
		}
	}

	return del([app + '/**' ].concat(excludeFolders).concat(excludeFiles));
};

var copySource = function (app) {
	var conf = require('./' + app + '/build.json');

	var files = conf['src-files'].map(function(s) {
		return conf.src + s;
	});

	for (var key in conf) {
		if (key !== 'src-files' && key.indexOf('src-') === 0 && Array.isArray(conf[key])) {
			conf[key].forEach(function(path) {
				var parts = path.split('/');
				var folder = conf.src + parts.slice(0, parts.length - 1).join('/');

				if (files.indexOf(folder + '/*.htm') < 0) {
					files = files.concat([
						folder + '/*.htm',
						folder + '/*.css'
					]);
				}

				files.push(conf.src + path);
			});
		}
	}

	return gulp.src(files, { base: conf.src })
		.pipe(changed(conf.dest))
		.pipe(gulp.dest(conf.dest));
};

var minifyApp = function (app) {
	var conf = require('./' + app + '/build.json');
	var path = pathInfo(conf['dist-app-js' ]);
	var tempFile = path.file + '.tmp';
	var outputDir = conf.dest + path.dir;

	return gulp.src(
		conf['src-app-js'].map(function(s) {
			return conf.dest + s;
		})
	)
	.pipe(sourcemaps.init())
	.pipe(concat(tempFile))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(outputDir))
	.pipe(rename(outputDir + tempFile, outputDir + path.file))
	.pipe(rename(outputDir + tempFile + '.map', outputDir + path.file + '.map'));
};

var minifyAngular = function (app) {
	var conf = require('./' + app + '/build.json');
	var path = pathInfo(conf['dist-angular-js' ]);
	var tempFile = path.file + '.tmp';
	var outputDir = conf.dest + path.dir;

	return gulp.src(
		conf['src-angular-js'].map(function(s) {
			return conf.dest + s;
		})
	)
	.pipe(concat(tempFile))
	.pipe(uglify())
	.pipe(gulp.dest(outputDir))
	.pipe(rename(outputDir + tempFile, outputDir + path.file));
};

var minifyLibJS = function (app) {
	var conf = require('./' + app + '/build.json');
	var path = pathInfo(conf['dist-lib-js' ]);
	var tempFile = path.file + '.tmp';
	var outputDir = conf.dest + path.dir;

	return gulp.src(
		conf['src-lib-js'].map(function(s) {
			return conf.dest + s;
		})
	)
	.pipe(concat(tempFile))
	.pipe(uglify())
	.pipe(gulp.dest(outputDir))
	.pipe(rename(outputDir + tempFile, outputDir + path.file));
};

var minifyLibCSS = function (app) {
	var conf = require('./' + app + '/build.json');
	var path = pathInfo(conf['dist-lib-css' ]);
	var tempFile = path.file + '.tmp';
	var outputDir = conf.dest + path.dir;

	return gulp.src(
		conf['src-lib-css'].map(function(s) {
			return conf.dest + s;
		})
	)
	.pipe(concat(tempFile))
	.pipe(minifyCss())
	.pipe(gulp.dest(outputDir))
	.pipe(rename(outputDir + tempFile, outputDir + path.file));
};

// minifies all directive css files
var minifyComponentCSS = function (app) {
	var conf = require('./' + app + '/build.json');
	//var path = pathInfo(conf['dist-app.js' ]);

	//return gulp.src(
	//		conf['src-lib-css'].map(function(s) {
	//			return conf.dest + s;
	//		})
	//		)
	//		.pipe(concat(path.file))
	//		.pipe(minifyCss())
	//		.pipe(gulp.dest(conf.dest + path.dir))

};


//
// Util methods for API tasks
//

var buildDocs = function(rootDir, callback) {

	var options = {
		themeVariables: 'default',
		includePath: rootDir
	};

	fs.readFile(rootDir + 'index.md', 'utf8', function (err, blueprint) {
		if (err) {
			throw err;
		}
		aglio.render(blueprint, options, function (err, html, warnings) {
			if (err) {
				throw err;
			}
			if (warnings[0]) {
				console.log('\x1b[43mAGLIO WARNINGS:\x1b[0m');

				var stack = [], indexStr = '';

				for (var i in warnings) {
					if (i === 'input') {
						indexStr = warnings[i];
					}
					else {
						stack.push(warnings[i]);
					}
				}

				for (var i in stack) {
					stack[i].location.forEach(function(loc) {
						var line = indexStr.substring(0, loc.index).split(/\n/g).length;

						console.log(
							'\x1b[33mLINE: \x1b[0m' + line + ' ' +
							'\n\x1b[33mMESSAGE: \x1b[0m' + stack[i].message + ' (code: ' + stack[i].code + ')' +
							'\n\x1b[33mSAMPLE: \x1b[0m' +
							'\x1b[36m\n--------------------------------------------------\n' +
							'...' + indexStr.substring(loc.index - 35, loc.index + loc.length + 35).replace(/\n\n*/g, '\n') + '...' +
							'\n--------------------------------------------------\n\x1b[0m'
						);
					})
				}

			}
			fs.writeFile(rootDir + 'index.html', html, 'utf8', callback);
		});
	});

};




//
// Util function to set up tasks for an angular app
//
var angularApp = function (name) {
	gulp.task('web-' + name + '-del', function() {
		return clean('web-' + name + '');
	});
	gulp.task('web-' + name + '-clean', ['web-' + name + '-del'], function() {
		return copySource('web-' + name + '');
	});
	gulp.task('web-' + name + '-copy-src', function() {
		return copySource('web-' + name + '');
	});
	gulp.task('web-' + name + '-minify-app', function() {
		return minifyApp('web-' + name + '');
	});
	gulp.task('web-' + name + '-build-angular', function() {
		return minifyAngular('web-' + name + '');
	});
	gulp.task('web-' + name + '-build-lib-js', function(){
		return minifyLibJS('web-' + name + '');
	});
	gulp.task('web-' + name + '-build-lib-css', function(){
		return minifyLibCSS('web-' + name + '');
	});

	gulp.task('web-' + name + '-build', ['web-' + name + '-minify-app', 'web-' + name + '-build-lib']);
	gulp.task('web-' + name + '-build-lib', ['web-' + name + '-build-lib-css', 'web-' + name + '-build-lib-js', 'web-' + name + '-build-angular']);

	gulp.task('watch-web-' + name + '', function(){
		gulp.watch(['web-base/**', 'web-' + name + '/build.json'], ['web-' + name + '-copy-src'])
	});
};


//
// Angular App - ARN Admin Portal
//

angularApp('arn');

//gulp.task('web-arn-del', function() {
//	return clean('web-arn');
//});
//gulp.task('web-arn-clean', ['web-arn-del'], function() {
//	return copySource('web-arn');
//});
//gulp.task('web-arn-copy-src', function() {
//	return copySource('web-arn');
//});
//gulp.task('web-arn-minify-app', function() {
//	return minifyApp('web-arn');
//});
//gulp.task('web-arn-build-angular', function() {
//	return minifyAngular('web-arn');
//});
//gulp.task('web-arn-build-lib-js', function(){
//	return minifyLibJS('web-arn');
//});
//gulp.task('web-arn-build-lib-css', function(){
//	return minifyLibCSS('web-arn');
//});
//
//gulp.task('web-arn-build', ['web-arn-minify-app', 'web-arn-build-lib']);
//gulp.task('web-arn-build-lib', ['web-arn-build-lib-css', 'web-arn-build-lib-js', 'web-arn-build-angular']);
//
//gulp.task('watch-web-arn', function(){
//	gulp.watch(['web-base/**', 'web-arn/build.json'], ['web-arn-copy-src'])
//});





//
// Angular App - AC Gallery Portal
//
angularApp('ac-gallery');





//
// API V1
//

gulp.task('v1-docs', function(complete) {
	buildDocs('api/v1/docs/', complete);
});


//
// API V2
//

gulp.task('v2-docs', function(complete) {
	buildDocs('api/v2/docs/', complete);
});


//
// API (All Versions)
//

gulp.task('docs', ['v1-docs', 'v2-docs']);

gulp.task('watch-docs', function() {
	gulp.watch(['api/v1/docs/**', '!api/v1/docs/index.html'], ['v1-docs']);
	gulp.watch(['api/v2/docs/**', '!api/v2/docs/index.html'], ['v2-docs']);
});



//
// Global tasks
//


gulp.task('watch', ['watch-docs', 'watch-web-arn']);

gulp.task('default', ['web-arn-build', 'web-ac-gallery-build']);
gulp.task('clean', ['web-arn-clean', 'web-ac-gallery-clean']);
