
const gulp = require('gulp');
const git = require('../');

// Init a git repo

gulp.task('init', () => {
	git.init();
});

// Add files

gulp.task('add', () => {
	gulp.src('./*')
		.pipe(git.add());
});

// Commit files

gulp.task('commit', () => {
	gulp.src('./*', {buffer: false})
		.pipe(git.commit('initial commit'));
});

// Commit files with arguments
gulp.task('commitopts', () => {
	gulp.src('./*')
		.pipe(git.commit('initial commit', {args: '-v'}));
});

// Commit files using raw arguments, without message checking
gulp.task('commitraw', () => {
	gulp.src('./*')
		.pipe(git.commit(undefined, {
			args: '-m "initial commit"',
			disableMessageRequirement: true,
		}));
});

// Commit files using raw arguments, without message checking
gulp.task('commitmulti', () => {
	gulp.src('./*')
		.pipe(git.commit(['initial commit', 'additional message']));
});

// Commit files using the multiline option
gulp.task('commitmultiline', () => {
	gulp.src('./*')
		.pipe(git.commit(['initial commit', 'additional message'], {mutiline: true}));
});

// Commit files with multiline messages
gulp.task('commitmultiline', () => {
	gulp.src('./*')
		.pipe(git.commit('initial commit\nadditional message'));
});

// Clone remote repo to current directory ($CWD/git-test)
gulp.task('clone', () => {
	git.clone('https://github.com/stevelacy/git-test', err => {
		if (err) {
			console.error(err);
		}
	});
});

// Clone remote repo to sub folder ($CWD/sub/folder/git-test)
gulp.task('clonesub', () => {
	git.clone('https://github.com/stevelacy/git-test', {args: './sub/folder'}, err => {
		if (err) {
			console.error(err);
		}
	});
});

// Lint js files in index before git commit
gulp.task('precommit', () => {
	const eslint = require('gulp-eslint');
	// Get changes between HEAD and index
	return git.diff('--cached', {
		args: '-- *.js',
	})
	// Read file contents from git index
		.pipe(git.catFile())
	// Lint files that different between HEAD and index
		.pipe(eslint())
	// Outputs the lint results to the console.
		.pipe(eslint.format())
	// To have the process exit with an error code (1) on
		.pipe(eslint.failAfterError());
});

// Add remote

gulp.task('remote', () => {
	git.addRemote('origin', 'https://github.com/stevelacy/git-test', err => {
		if (err) {
			console.error(err);
		}
	});
});

// Push to remote repo

gulp.task('push', () => {
	git.push('origin', 'master', err => {
		if (err) {
			console.error(err);
		}
	});
});

// Pull from remote repo

gulp.task('pull', () => {
	git.pull('origin', 'master', err => {
		if (err) {
			console.log(err);
		}
	});
});

// Pull from remote repo with only origin

gulp.task('pull-origin', () => {
	git.pull('origin', err => {
		if (err) {
			console.log(err);
		}
	});
});

// Pull from all remote branches and tags

gulp.task('pull-all', () => {
	git.pull(err => {
		if (err) {
			console.log(err);
		}
	});
});

// Pull from array of branches

gulp.task('pull-array', () => {
	git.pull('origin', ['master', 'development'], err => {
		if (err) {
			console.log(err);
		}
	});
});

// Tag the repo

gulp.task('tag', () => {
	git.tag('v1.1.1', 'Version message', err => {
		if (err) {
			console.error(err);
		}
	});
});

// Tag the repo WITH signed key
gulp.task('tagsec', () => {
	git.tag('v1.1.1', 'Version message with signed key', {signed: true}, err => {
		if (err) {
			console.error(err);
		}
	});
});

gulp.task('push-tag', () => {
	git.push('origin', 'v1.1.1', err => {
		if (err) {
			console.error(err);
		}
	});
});

gulp.task('rm', () => {
	gulp.src('./delete')
		.pipe(git.rm({args: '-f'}));
});

gulp.task('addSubmodule', () => {
	git.addSubmodule('https://github.com/stevelacy/git-test', 'git-test', {args: '-b master'});
});

gulp.task('updateSubmodules', () => {
	git.updateSubmodule({args: '--init'});
});

// Default gulp task

gulp.task('default', ['add']);
