
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

	const paths = [];
	const files = [];
	let fileCwd = process.cwd;

	const write = function (file, enc, cb) {
		paths.push(file.path);
		files.push(file);
		fileCwd = file.cwd;
		cb();
	};

	const flush = function (cb) {
		const cwd = opt.cwd || fileCwd;

		const cmd = 'git add ' + escape(paths) + ' ' + opt.args;
		const that = this;
		const maxBuffer = opt.maxBuffer || 200 * 1024;

		exec(cmd, {cwd, maxBuffer}, (err, stdout, stderr) => {
			if (err) {
				cb(err);
			}
			if (!opt.quiet) {
				gutil.log(stdout, stderr);
			}
			files.forEach(that.push.bind(that));
			that.emit('end');
			cb();
		});
	};

	return through.obj(write, flush);
};
