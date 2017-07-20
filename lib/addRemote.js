
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (remote, url, opt, cb) {
	if (!cb && typeof opt === 'function') {
		// Optional options
		cb = opt;
		opt = {};
	}
	if (!cb || typeof cb !== 'function') {
		cb = function () {};
	}
	if (!url) {
		return cb(new Error('gulp-git: Repo URL is required git.addRemote("origin", "https://github.com/user/repo.git")'));
	}
	if (!remote) {
		remote = 'origin';
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

	const cmd = 'git remote add ' + opt.args + ' ' + escape([remote, url]);
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
