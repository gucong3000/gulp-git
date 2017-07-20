
var path = require('path');
var rimraf = require('rimraf');
var gutil = require('gulp-util');
var git = require('../');

// Just so this file is clean
var util = require('./_util');

// Omit logging
gutil.log = function () {};

describe('gulp-git', function () {
	var testSuite = util.testSuite();

	testSuite.forEach(function (file) {
		var suite = path.basename(file, path.extname(file));
		describe(suite, function () {
			// The actual suite code
			if (/\.js$/.test(file)) {
				require('./' + file)(git, util);
			}
		});
	});

	// Wipe
	after(function (done) {
		rimraf('test/repo', function (err) {
			if (err) {
				return done(err);
			}
			done();
		});
	});
});
