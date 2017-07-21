
const pick = require('lodash.pick');
const warp = require('./warp');
/**
 * Class: git child process helper
 *
 * @param   {Object}  [options]                 options
 * @param   {Object}  [options.config]          `-c` from `git`
 * @param   {string}  [options.gitDir]          `--git-dir` from `git`
 * @param   {string}  [options.workTree]        `--work-tree` from `git`
 * @param   {boolean} [options.pager]           `--no-pager` from `git`
 * @param   {string}  [options.binary]          path to the git binary to use
 * @param   {string}  [options.cwd]             Current working directory of git process
 * @returns {GIT}     child process helper
 */
function Git(options) {
	if (!this || !(this instanceof Git)) {
		return new Git(options);
	}
	if (!Git.options.cwd) {
		Git.options.cwd = process.cwd();
	}
	options = Object.assign(Git.options, options);
	const _args = [];

	if (!options.pager) {
		_args.push('--no-pager');
	}

	if (options.gitDir) {
		_args.push('--git-dir=' + options.gitDir);
	}

	if (options.workTree) {
		_args.push('--work-tree=' + options.workTree);
	}

	if (options.config) {
		Object.keys(options.config).forEach(key => {
			_args.push('-c', key + '=' + String(options.config[key]));
		});
	}
	this._args = _args;
	this._binary = options.binary;
	this._options = pick(options, [
		'cwd',
		'env',
		'argv0',
		'stdio',
		'detached',
		'uid',
		'gid',
		'shell',
	]);
}

Git.options = {
	pager: false,
	binary: 'git',
	config: {
		'core.quotepath': false,
		'diff.mnemonicprefix': false,
	},
};
Git.prototype.spawn = require('./spawn');

[
	'diff',
	'blame',
	'log',
	'catFile',
	'lsFiles',
	'stash',
].forEach(fn => {
	Git.prototype[fn] = warp(require('./' + fn));
});
module.exports = Git;
