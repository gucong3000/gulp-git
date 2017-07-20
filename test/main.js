
const path = require('path');
const rimraf = require('rimraf');
const gutil = require('gulp-util');
const git = require('../');

// Just so this file is clean
const util = require('./_util');

// Omit logging
gutil.log = function () {};

describe('gulp-git', () => {
	const testSuite = util.testSuite();

	testSuite.forEach(file => {
		const suite = path.basename(file, path.extname(file));
		describe(suite, () => {
			// The actual suite code
			if (/\.js$/.test(file)) {
				require('./' + file)(git, util);
			}
		});
	});

	// Wipe
	after(done => {
		rimraf('test/repo', err => {
			if (err) {
				return done(err);
			}
			done();
		});
	});
});
