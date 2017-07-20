
const through = require('through2');
const Vinyl = require('vinyl');
const path = require('path');
const debug = require('debug')('gulp-git:ls-files');

function getReaslt(data) {
	data = data && data.toString();
	debug(data);

	return data.split(/\u0000/g).filter(Boolean).map(file => {
		file = /^(?:(\w+)\s+)?(\w+)\s+(\w+)\s+(\w+)\t+(.*)$/g.exec(file);
		return {
			tag: file[1],
			mode: file[2],
			object: file[3],
			stage: file[4],
			file: file[5],
		};
	});
}

module.exports = function (opt) {
	opt = Object.assign({
		cwd: process.cwd(),
		args: [],
	}, opt);
	const srcStream = through.obj();
	this.spawn(
		[
			'ls-files',
			'--stage',
			'-z',
		]
			.concat(opt.args)
	)
		.then(getReaslt)
		.then(files => {
			files.forEach(file => {
				srcStream.write(new Vinyl({
					path: path.resolve(opt.cwd, file.file),
					cwd: opt.cwd,
					base: opt.base,
					git: {
						tag: file.tag,
						mode: file.mode,
						stage: file.stage,
						hash: file.object,
					},
				}));
			}, {
				cwd: opt.cwd,
			});
			srcStream.end();
		}).catch(srcStream.emit.bind(srcStream, 'error'));

	return srcStream
		.pipe(this.catFile(opt));
};
