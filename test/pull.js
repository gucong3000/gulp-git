
const should = require('should');

module.exports = function (git) {
	it.skip('should pull from the remote repo', done => {
		git.pull('origin', 'master', {cwd: './test/'}, () => {
			should.exist('./test/.git/refs/heads/master');
			done();
		});
	});
};
