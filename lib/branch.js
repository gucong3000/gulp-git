
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

// Want to get the current branch instead?
// git.revParse({args:'--abbrev-ref HEAD'})

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
		return cb(new Error('gulp-git: Branch name is required git.branch("name")'));
	}
	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}
	if (!opt.args) {
		opt.args = ' ';
	}

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	const cmd = 'git branch ' + opt.args + ' ' + escape([branch]);
	return exec(cmd, {cwd: opt.cwd, maxBuffer}, (err, stdout, stderr) => {
		if (err) {
			return cb(err);
		}
		if (!opt.quiet) {
			gutil.log(stdout, stderr);
		}
		cb(null, stdout);
	});
};
