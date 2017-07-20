
const gutil = require('gulp-util');
const exec = require('child_process').exec;

module.exports = function (opt, cb) {
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
	if (!opt.cwd) {
		opt.cwd = process.cwd();
	}
	if (!opt.args) {
		opt.args = ' ';
	}
	if (!opt.maxBuffer) {
		opt.maxBuffer = 200 * 1024;
	} // Default buffer value for child_process.exec

	const cmd = 'git status ' + opt.args;
	return exec(cmd, {cwd: opt.cwd, maxBuffer: opt.maxBuffer}, (err, stdout, stderr) => {
		if (err) {
			return cb(err, stderr);
		}
		if (!opt.quiet) {
			gutil.log(cmd + '\n' + stdout, stderr);
		}
		if (cb) {
			cb(err, stdout);
		}
	});
};
