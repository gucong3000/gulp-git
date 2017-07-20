/* global beforeEach, it, afterEach */

const fs = require('fs');
const rimraf = require('rimraf');

module.exports = function (git) {
	const repoPath = './test/tmp';

	beforeEach(done => {
		const repo = 'git://github.com/stevelacy/git-test';
		git.clone(repo, {args: repoPath}, done);
	});

	it('should remove an untracked file from the repo', done => {
		const filePath = repoPath + '/test.txt';
		fs.writeFile(filePath, 'Hello git clean test', err => {
			if (err) {
				return done(err);
			}
			git.clean({cwd: repoPath, args: '-f'}, err => {
				if (err) {
					return done(err);
				}
				fs.stat(filePath, err => {
					if (err) {
						return done();
					}
					done(new Error('Failed to remove file'));
				});
			});
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
