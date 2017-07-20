
const fs = require('fs');
const gutil = require('gulp-util');

module.exports = function (git, util) {
	it('should rm a file', done => {
		const opt = {args: '-f', cwd: 'test/repo'};
		const fakeFile = new gutil.File(util.testFiles[0]);
		const gitS = git.rm(opt);
		gitS.once('data', newFile => {
			setTimeout(() => {
				fs.exists('test/repo/' + newFile, exists => {
					exists.should.be.false();
				});
				done();
			}, 100);
		});
		gitS.write(fakeFile);
		gitS.end();
	});

	it('should rm multiple files', done => {
		const fakeFiles = [];
		util.testFiles.slice(1).forEach(file => {
			fakeFiles.push(new gutil.File(file));
		});

		const opt = {args: '-f', cwd: 'test/repo'};
		const gitS = git.rm(opt);
		gitS.on('data', newFile => {
			fs.exists('test/repo/' + newFile, exists => {
				exists.should.be.false();
			});
		});
		gitS.once('end', done);
		fakeFiles.forEach(fake => {
			gitS.write(fake);
		});
		gitS.end();
	});
};
