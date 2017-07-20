
const fs = require('fs');
const should = require('should');

module.exports = function (git) {
	it('should remove the Remote origin from the git repo', done => {
		const opt = {cwd: './test/repo/'};
		git.removeRemote('origin', opt, () => {
			fs.stat('./test/repo/.git/', err => {
				should.not.exist(err);
				fs.readFileSync('./test/repo/.git/config')
					.toString('utf8')
					.should.not.match(/https:\/\/github.com\/stevelacy\/git-test/);
				done();
			});
		});
	});

	it('should return an error if no remote exists', done => {
		const opt = {cwd: './test/repo/'};
		git.removeRemote(opt, e => {
			should(e.message).match('gulp-git: remote is required git.removeRemote("origin")');
			done();
		});
	});
};
