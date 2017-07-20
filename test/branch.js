
const fs = require('fs');
const should = require('should');

module.exports = function (git) {
	it('should create a new branch', done => {
		const opt = {cwd: './test/repo/'};
		git.branch('testBranch', opt, () => {
			fs.stat('test/repo/.git/refs/heads/testBranch', err => {
				should.not.exist(err);
				done();
			});
		});
	});

	it('should create new branch, checkout and return its name', done => {
		let opt = {cwd: './test/repo/'};
		git.branch('anotherBranch', opt, () => {
			fs.stat('test/repo/.git/refs/heads/anotherBranch', err => {
				should.not.exist(err);
				git.checkout('anotherBranch', opt, () => {
					opt = {args: '--abbrev-ref HEAD', cwd: opt.cwd};
					git.revParse(opt, (err, branch) => {
						branch.should.equal('anotherBranch');
						should.not.exist(err);
						done();
					});
				});
			});
		});
	});
};
