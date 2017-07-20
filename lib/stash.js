
module.exports = function (operate, opt) {
	opt = Object.assign({
		args: 'gulp-stash',
	}, opt);

	return this.spawn([
		'stash',
	].concat(operate).concat(opt.args));
};
