
const through = require('through2');
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const escape = require('any-shell-escape');

module.exports = function (opt) {
	if (!opt) {
		opt = {};
	}
	if (!opt.args) {
		opt.args = ' ';
	}

	function checkout(file, enc, cb) {
		const that = this;
		const cmd = 'git checkout ' + opt.args + ' ' + escape([file.path]);
		if (!cb || typeof cb !== 'function') {
			cb = function () {};
		}

		const maxBuffer = opt.maxBuffer || 200 * 1024;

		exec(cmd, {cwd: file.cwd, maxBuffer}, (err, stdout, stderr) => {
			if (err) {
				return cb(err);
			}
			if (!opt.quiet) {
				gutil.log(stdout, stderr);
			}
			that.push(file);
			cb(null);
		});
	}

	// Return a stream
	return through.obj(checkout);
};
