
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (remote, opt, cb) {
	if (!cb && typeof opt === 'function') {
		// Optional options
		cb = opt;
		opt = {};
	}
	if (!remote || typeof remote !== 'string') {
		const error = new Error('gulp-git: remote is required git.removeRemote("origin")');
		if (!cb || typeof cb !== 'function') {
			throw error;
		}
		return cb(error);
	}
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

	const cmd = 'git remote remove ' + opt.args + ' ' + escape([remote]);
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
