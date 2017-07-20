
const fs = require('fs');

module.exports = function (git) {
	it('should checkout a branch', done => {
		const opt = {cwd: 'test/repo'};
		git.checkout('testBranch', opt, () => {
			fs.readFileSync('test/repo/.git/HEAD')
				.toString('utf8')
				.should.match(/ref\: refs\/heads\/testBranch/);

			done();
		});
	});
};
