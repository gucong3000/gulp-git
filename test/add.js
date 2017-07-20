
const fs = require('fs');
const should = require('should');
const gutil = require('gulp-util');

module.exports = function (git, util) {
	it('should add files to the git repo', done => {
		const fakeFile = new gutil.File(util.testFiles[0]);
		const gitS = git.add();
		gitS.on('data', newFile => {
			should.exist(newFile);
			fs.stat('test/repo/.git/objects/', err => {
				should.not.exist(err);
				done();
			});
		});
		gitS.write(fakeFile);
		gitS.end();
	});

	it('should add multiple files to the git repo', done => {
		const fakeFiles = [];
		util.testFiles.forEach(name => {
			fakeFiles.push(new gutil.File(name));
		});
		const gitS = git.add();
		gitS.on('data', newFile => {
			should.exist(newFile);
			fs.stat('test/repo/.git/objects/', err => {
				should.not.exist(err);
			});
		});
		fakeFiles.forEach(file => {
			gitS.write(file);
		});
		gitS.end(done);
	});

	it('should fire an end event', done => {
		const fakeFile = new gutil.File(util.testFiles[0]);
		const gitS = git.add();

		gitS.on('end', () => {
			done();
		});

		gitS.write(fakeFile);
		gitS.end();
	});
};
