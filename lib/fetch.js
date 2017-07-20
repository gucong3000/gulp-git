
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (remote, branch, opt, cb) {
	if (!cb && typeof opt === 'function') {
		// Optional options
		cb = opt;
		opt = {};
	}
	if (!cb || typeof cb !== 'function') {
		cb = function () {};
	}
	if (!branch) {
		branch = '';
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
	if (!remote && opt.args.indexOf('--all') === -1) {
		remote = 'origin';
	}

	const maxBuffer = opt.maxBuffer || 200 * 1024;

	let cmd = 'git fetch ' + opt.args;
	let args = [];
	if (remote) {
		args.push(remote);
	}
	if (branch) {
		args = args.concat(branch);
	}
	if (args.length > 0) {
		cmd += escape(args);
	}
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
