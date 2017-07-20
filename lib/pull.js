
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (remote, branch, opt, cb) {
	if (!cb && typeof opt === 'function') {
		// Optional options
		cb = opt;
		opt = {};
	}
	// Pull with callback only
	if (!cb && typeof remote === 'function') {
		cb = remote;
		remote = {};
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

	let cmd = 'git pull ' + opt.args;
	if (typeof remote === 'string') {
		cmd += ' ' + escape(remote);
	}
	if (branch && typeof branch === 'string' || branch && branch[0]) {
		cmd += ' ' + escape([].concat(branch));
	}
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
