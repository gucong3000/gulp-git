
const fs = require('fs');
const rimraf = require('rimraf');
const should = require('should');

module.exports = function (git) {
	it('should add a submodule to the git repo', done => {
		const opt = {cwd: 'test/repo'};
		const url = 'https://github.com/stevelacy/git-test';

		git.addSubmodule(url, 'testSubmodule', opt, () => {
			fs.readFileSync('test/repo/.gitmodules')
				.toString('utf8')
				.should.match(new RegExp(url.replace(/[/]/g, '\\$&')));
			fs.stat('test/repo/testSubmodule/.git', err => {
				should.not.exist(err);
				done();
			});
		});
	});

	it('should update submodules', done => {
		const args = {cwd: 'test/repo'};

		git.updateSubmodule(args, () => {
			fs.stat('test/repo/testSubmodule/.git', err => {
				should.not.exist(err);
				done();
			});
		});
	});

	after(done => {
		rimraf('test/repo/testSubmodule', err => {
			if (err) {
				return done(err);
			}
			done();
		});
	});
};
