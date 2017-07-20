
const fs = require('fs');
const rimraf = require('rimraf');
const should = require('should');

module.exports = function (git) {
	beforeEach(done => {
		const repo = 'git://github.com/stevelacy/gulp-git';
		git.clone(repo, {args: './test/tmp'}, done);
	});

	it('should have cloned project into tmp directory', done => {
		fs.stat('./test/tmp/.git', err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(done => {
		rimraf('./test/tmp', err => {
			if (err) {
				return done(err);
			}
			done();
		});
	});
};
