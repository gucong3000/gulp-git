
/* global describe, it, after, before, afterEach, beforeEach */

const fs = require('fs');
const rimraf = require('rimraf');
const should = require('should');
const exec = require('child_process').exec;

module.exports = function (git) {
	beforeEach(done => {
		const repo = 'git://github.com/stevelacy/git-test';
		git.clone(repo, {args: './test/tmp'}, () => {
			exec('git update-ref -d refs/tags/v1.1.1', {cwd: './test/tmp'}, err => {
				if (err) {
					return done(err);
				}
				done();
			});
		});
	});

	it('should fetch a tag from remote origin', done => {
		git.fetch('origin', '', {cwd: './test/tmp'}, () => {
			fs.open('./test/tmp/.git/refs/tags/v1.1.1', 'r', (err, fd) => {
				should.not.exist(err);
				fs.close(fd, () => {
					done();
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
