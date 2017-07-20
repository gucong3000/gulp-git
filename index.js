
const Git = require('./lib/git');
let git;

function getGit() {
	if (!git) {
		git = new Git();
	}
	return git;
}
module.exports = new Proxy(
	(...options) => new Git(...options),
	{
		get: (target, prop) => (
			Git.prototype[prop] || getGit()[prop] || target[prop]
		)
	}
);
