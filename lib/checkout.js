
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (branch, opt, cb) {
	if (!cb && typeof opt === 'function') {
		// Optional options
		cb = opt;
		opt = {};
	}
	if (!cb || typeof cb !== 'function') {
		cb = function () {};
	}
	if (!opt) {
		opt = {};
	}
	if (!branch) {
		throw new Error('gulp-git: Branch name is require git.checkout("name")');
	}
	if (!opt.args) {
		opt.args = ' ';
	}
	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	const cmd = 'git checkout ' + opt.args + ' ' + escape([branch]);
	exec(cmd, {cwd: opt.cwd, maxBuffer}, (err, stdout, stderr) => {
		if (err) {
			return cb(err);
		}
		if (!opt.quiet) {
			gutil.log(stdout, stderr);
		}
		cb(null);
	});
};
