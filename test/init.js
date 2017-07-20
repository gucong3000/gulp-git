
const fs = require('fs');
const should = require('should');

module.exports = function (git) {
	before(done => {
		git.init({cwd: './test/repo/'}, done);
	});

	it('should initialize a empty git repo', done => {
		fs.stat('test/repo/.git/', err => {
			should.not.exist(err);
			done();
		});
	});
};
