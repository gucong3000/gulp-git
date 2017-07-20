
const fs = require('fs');

module.exports = function (git, util) {
	it('should merge branches', done => {
		const opt = {cwd: './test/repo'};
		git.merge('testBranch', opt, () => {
			setTimeout(() => {
				fs.readFileSync(util.testCommit)
					.toString('utf8')
					.should.match(/initial commit/);
				done();
			}, 100);
		});
	});
};
