
const fs = require('fs');
const path = require('path');
const should = require('should');
const gutil = require('gulp-util');

module.exports = function (git, util) {
	it('should git status --porcelain', done => {
		const opt = {args: '--porcelain', cwd: 'test/repo'};
		const fakeFile = new gutil.File(util.testFiles[0]);
		const fakeRelative = '?? ' + path.relative(util.repo, fakeFile.path);
		fs.openSync(fakeFile.path, 'w');

		git.status(opt, (err, stdout) => {
			should(err).be.eql(null);
			fs.exists(fakeFile.path, exists => {
				exists.should.be.true();
				stdout.split('\n')
					.should.containDeep([fakeRelative]);
				done();
			});
		});
	});
};
