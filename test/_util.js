
const fs = require('fs');
const path = require('path');
const Vinyl = require('vinyl');

const repo = path.join(__dirname, 'repo');

const fileContents = function () {
	if (fs.existsSync(repo)) {
		return fs.readFileSync('test/repo/testContents.js');
	}

	fs.mkdirSync(repo);
	fs.openSync(path.join(repo, 'testContents.js'), 'w');
	return fs.readFileSync('test/repo/testContents.js');
};

const testFiles = (function () {
	const testFiles = [];
	for (let i = 0; i < 10; i++) {
		testFiles[i] = {
			base: 'test/repo',
			cwd: 'test/repo',
			path: __dirname + '/repo/test.' + i + '.js',
			contents: new Buffer(fileContents()),
		};
		fs.openSync(testFiles[i].path, 'w');
	}
	return testFiles;
}).call(this);

const testOptionsFiles = (function () {
	const testFiles = [];
	for (let i = 0; i < 12; i++) {
		testFiles[i] = new Vinyl({
			base: 'test/repo',
			cwd: 'test/repo',
			path: __dirname + '/repo/test.options.' + i + '.js',
			contents: new Buffer(fileContents()),
		});
		fs.openSync(testFiles[i].path, 'w');
	}
	return testFiles;
}).call(this);

module.exports = {
	repo,
	fileContents: fileContents(),
	testCommit: path.join(repo, '.git', 'COMMIT_EDITMSG'),
	testFiles,
	testOptionsFiles,
	testSuite() {
		const testSuite = fs.readdirSync(__dirname);
		const testFirst = [
			'clone.js', 'init.js', 'add.js', 'commit.js', 'stash.js',
		];

		// Use it also to omit _main & _util files
		testFirst.concat('main.js', '_util.js', 'repo').forEach(file => {
			testSuite.splice(testSuite.indexOf(file), 1);
		});
		testSuite.unshift.apply(testSuite, testFirst);
		return testSuite;
	},
};
