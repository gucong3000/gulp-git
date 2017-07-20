
const fs = require('fs');
const exec = require('child_process').exec;
const isVinyl = require('vinyl').isVinyl;

module.exports = function (git, util) {
	it('should commit a file to the repo', done => {
		const fakeFile = util.testFiles[0];
		const opt = {cwd: './test/repo/'};
		const gitS = git.commit('initial commit', opt);
		gitS.once('finish', () => {
			setTimeout(() => {
				fs.readFileSync(util.testCommit)
					.toString('utf8')
					.should.match(/initial commit/);
				done();
			}, 100);
		});
		gitS.write(fakeFile);
		gitS.end();
	});

	it('should fire an end event', done => {
		const fakeFile = util.testFiles[2];
		const opt = {cwd: './test/repo/'};
		const gitS = git.commit('initial commit', opt);

		gitS.on('end', () => {
			done();
		});

		gitS.write(fakeFile);
		gitS.end();
	});

	it('should commit a file to the repo using raw arguments only', done => {
		const fakeFile = util.testFiles[3];
		const opt = {cwd: './test/repo/', args: '-m "initial commit"', disableMessageRequirement: true};
		const gitS = git.commit(undefined, opt);
		gitS.once('finish', () => {
			setTimeout(() => {
				fs.readFileSync(util.testCommit)
					.toString('utf8')
					.should.match(/initial commit/);
				done();
			}, 100);
		});
		gitS.write(fakeFile);
		gitS.end();
	});

	it('should commit a file to the repo when appending paths is disabled', done => {
		const fakeFile = util.testOptionsFiles[4];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/', disableAppendPaths: true};
				const gitS = git.commit('initial commit', opt);
				gitS.on('end', err => {
					if (err) {
						console.error(err);
					}
					setTimeout(() => {
						fs.readFileSync(util.testCommit)
							.toString('utf8')
							.should.match(/initial commit/);
						done();
					}, 100);
				});
				gitS.write(fakeFile);
				gitS.end();
			});
	});

	it('should commit a file to the repo when passing multiple messages', done => {
		const fakeFile = util.testOptionsFiles[5];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/', disableAppendPaths: true};
				const gitS = git.commit(['initial commit', 'additional message'], opt);
				gitS.on('end', err => {
					if (err) {
						console.error(err);
					}
					setTimeout(() => {
						const result = fs.readFileSync(util.testCommit)
							.toString('utf8');
						result.should.match(/initial commit/);
						result.should.match(/additional message/);
						done();
					}, 100);
				});
				gitS.write(fakeFile);
				gitS.end();
			});
	});

	it('should commit a file to the repo when passing a message with newlines', done => {
		const fakeFile = util.testOptionsFiles[10];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/', disableAppendPaths: true};
				const gitS = git.commit('initial commit\nadditional message', opt);
				gitS.on('end', err => {
					if (err) {
						console.error(err);
					}
					setTimeout(() => {
						const result = fs.readFileSync(util.testCommit)
							.toString('utf8');
						result.should.match(/initial commit\nadditional message/);
						done();
					}, 300);
				});
				gitS.write(fakeFile);
				gitS.end();
			});
	});

	it('should commit a file to the repo when passing multiple messages and multiline option', done => {
		const fakeFile = util.testOptionsFiles[11];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/', disableAppendPaths: true, multiline: true};
				const gitS = git.commit(['initial commit', 'additional message'], opt);
				gitS.on('end', err => {
					if (err) {
						console.error(err);
					}
					setTimeout(() => {
						const result = fs.readFileSync(util.testCommit)
							.toString('utf8');
						result.should.match(/initial commit\nadditional message/);
						done();
					}, 300);
				});
				gitS.write(fakeFile);
				gitS.end();
			});
	});

	it('should not fire a data event by default', done => {
		const fakeFile = util.testOptionsFiles[9];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/'};
				const gitS = git.commit('initial commit', opt);
				let gotData = false;

				gitS.on('data', data => {
					if (!isVinyl(data)) {
						console.log(data);
						gotData = true;
					}
				});

				gitS.once('end', () => {
					gotData.should.be.false();
					done();
				});

				gitS.write(fakeFile);
				gitS.end();
			});
	});

	it('should fire a data event if emitData is true', done => {
		const fakeFile = util.testOptionsFiles[6];
		exec('git add ' + fakeFile.path, {cwd: './test/repo/'},
			error => {
				if (error) {
					return done(error);
				}
				const opt = {cwd: './test/repo/', emitData: true};
				const gitS = git.commit('initial commit', opt);
				let gotData = false;

				gitS.on('data', data => {
					if (!isVinyl(data)) {
						gotData = true;
					}
				});

				gitS.once('end', () => {
					gotData.should.be.true();
					done();
				});
				gitS.write(fakeFile);
				gitS.end();
			});
	});
};
