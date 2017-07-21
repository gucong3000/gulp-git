const Vinyl = require('vinyl');
const path = require('path');
const toArgv = require('argv-formatter').format;
const debug = require('debug')('gulp-git:diff');

function parse(data) {
	data = data.replace(/^:/, '').split(/\u0000|\.*\s+/g);
	debug(data);
	return {
		// Mode for compare "src"
		srcMode: data[0] - 0,
		// Mode for compare "dst"
		dstMode: data[1] - 0,
		// Sha1 for compare "src"
		srcHash: data[2],
		// Sha1 for compare "dst"
		dstHash: data[3],
		// Status
		status: data[4],
		// Path for compare "src"
		srcPath: data[5],
		// Path for compare "dst"
		dstPath: data[6] || data[5],
	};
}

module.exports = {
	separator: /\u0000(?=:)/g,
	mapper: (options, data) => {
		const diff = parse(data);
		return new Vinyl({
			path: path.resolve(options.cwd, diff.dstPath),
			cwd: options.cwd,
			base: options.base,
			git: {
				hash: diff.dstHash,
				diff,
			},
		});
	},
	parse,
	args(compare = 'origin/master...', options) {
		options = Object.assign({
			'diff-filter': 'ACMR',
			raw: true,
			z: true,
			format: '```split_log_start```{"hash":"%H","tree":"%T","parent":"%P","author":{"name":"%aN","email":"%aE","time":%at},"committer":{"name":"%cN","email":"%cE","time":%ct}}```split_body_start```%B```split_body_end```',
		}, options);
		return {
			args: ['diff'].concat(toArgv(options)).concat(compare),
			options: Object.assign(options, {
				cwd: this._options.cwd || process.cwd(),
			}),
		};
	},
};
