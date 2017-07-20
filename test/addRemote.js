
const fs = require('fs');

module.exports = function (git) {
	it('should add a Remote to the git repo', done => {
		const opt = {cwd: './test/repo/'};
		const origin = 'https://github.com/stevelacy/git-test';
		git.addRemote('origin', origin, opt, () => {
			fs.statSync('./test/repo/.git/');
			fs.readFileSync('./test/repo/.git/config')
				.toString('utf8')
				.should.match(/https:\/\/github.com\/stevelacy\/git-test/);
			done();
		});
	});
};
