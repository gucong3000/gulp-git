
const through = require('through2');
const toReadStream = require('spawn-to-readstream');
const spawn = require('child_process').spawn;
const debug = require('debug')('gulp-git:spawn');

module.exports = function (args, options) {
	options = Object.assign(this._options, options);
	const ps = spawn(
		this._binary,
		this._args.concat(args).filter(Boolean),
		options,
	);
	debug(ps.spawnargs.join(' '));
	const input = options.input;
	if (input) {
		if (input.pipe) {
			input.pipe(ps.stdin);
			ps.stdin.on('error', () => {
				// Console.error
			});
		} else {
			(Array.isArray(input) ? input : [input]).forEach(input => {
				ps.stdin.write(input);
				ps.stdin.end();
			});
		}
	}
	return toReadStream(ps);
};
