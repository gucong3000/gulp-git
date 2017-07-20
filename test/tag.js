
const fs = require('fs');
const should = require('should');

module.exports = function (git) {
	// These must be run on a system which has git installed
	// no pull delay, and has git configured.

	it('should tag a version of the repo', done => {
		git.tag('v1.2.3', 'message', {cwd: './test/repo/'}, () => {
			fs.stat('test/repo/.git/refs/tags/v1.2.3', err => {
				should.not.exist(err);
				done();
			});
		});
	});

	it('should not throw an error on success', done => {
		git.tag('v2', 'message', {cwd: './test/repo/'}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('should tag a version with an empty message', done => {
		git.tag('v3', '', {cwd: './test/repo/'}, err => {
			should.not.exist(err);
			fs.stat('test/repo/.git/refs/tags/v3', err => {
				should.not.exist(err);
				done();
			});
		});
	});
};
