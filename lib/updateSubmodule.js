
const gutil = require('gulp-util');
const exec = require('child_process').exec;

module.exports = function (opt, cb) {
	if (!cb || typeof cb !== 'function') {
		cb = function () {};
	}
	if (!opt) {
		opt = {};
	}
	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}
	if (!opt.args) {
		opt.args = ' ';
	}

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	const cmd = 'git submodule update ' + opt.args;
	return exec(cmd, {cwd: opt.cwd, maxBuffer}, (err, stdout, stderr) => {
		if (err && cb) {
			return cb(err);
		}
		if (!opt.quiet) {
			gutil.log(stdout, stderr);
		}
		if (cb) {
			cb();
		}
	});
};
