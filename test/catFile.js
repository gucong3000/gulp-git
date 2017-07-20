
const should = require('should');
const execSync = require('child_process').execSync;
const Vinyl = require('vinyl');

module.exports = function (git) {
	it('package.json', done => {
		if (!/\b(\S{40,})\b/.test(execSync('git ls-files -s -- package.json').toString())) {
			return;
		}
		const hash = RegExp.$1;

		const stream = git.catFile();

		stream.on('data', file => {
			should.exist(file.contents);
			done();
		});

		stream.write(new Vinyl({
			path: 'package.json',
			git: {
				hash,
			},
		}));
	});
};
