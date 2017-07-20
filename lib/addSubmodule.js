
const gutil = require('gulp-util');
const exec = require('child_process').exec;

module.exports = function (url, name, opt, cb) {
	if (!cb || typeof cb !== 'function') {
		cb = function () {};
	}
	if (!url) {
		return cb(new Error('gulp-git: Repo URL is required git.submodule.add("https://github.com/user/repo.git", "repoName")'));
	}
	if (!name) {
		name = '';
	}
	if (!opt) {
		opt = {};
	}
	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}
	if (!opt.args) {
		opt.args = '';
	}

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	const cmd = 'git submodule add ' + opt.args + ' ' + url + ' ' + name;
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
