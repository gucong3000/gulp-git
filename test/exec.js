
const should = require('should');

module.exports = function (git) {
	it('should git.exec log', done => {
		const opt = {args: 'log', cwd: 'test/repo'};
		git.exec(opt, (err, stdout) => {
			should(stdout.match(/commit|Author|Date/g))
				.have.property('length');
			done();
		});
	});
};
