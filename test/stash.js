
const fs = require('fs');

module.exports = function (git) {
	it('should stash a branch', done => {
		const opt = {cwd: './test/repo'};
		git.stash(opt, () => {
			fs.readFileSync('test/repo/.git/logs/refs/stash')
				.toString('utf8')
				.should.match(/gulp-stash/);
			done();
		});
	});

	it('should unstash a branch', done => {
		const opt = {cwd: './test/repo', args: 'pop'};
		git.stash(opt, () => {
			fs.open('test/repo/.git/refs/stash', 'r', err => {
				err.code.should.be.exactly('ENOENT');
				done();
			});
		});
	});
};
