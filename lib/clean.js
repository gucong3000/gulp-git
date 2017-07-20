
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (paths, opt, cb) {
	if (!cb) {
		if (typeof opt === 'function') {
			// Passed in 2 arguments
			cb = opt;
			if (typeof paths === 'object') {
				opt = paths;
				paths = '';
			} else {
				opt = {};
			}
		} else {
			// Passed in only cb
			cb = paths;
			paths = '';
			opt = {};
		}
	}

	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}
	if (!opt.args) {
		opt.args = ' ';
	}

	const cmd = 'git clean ' + opt.args + ' ' + (paths.trim() ? (' -- ' + escape(paths)) : '');

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	return exec(cmd, {cwd: opt.cwd, maxBuffer}, (err, stdout, stderr) => {
		if (err) {
			return cb(err);
		}
		if (!opt.quiet) {
			gutil.log(stdout, stderr);
		}
		cb();
	});
};
