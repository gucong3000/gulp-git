
/**
 * CatFile
 * @module gulp-git/lib/catFile
 */

const through = require('through2');
const stripBom = require('strip-bom-stream');
const getStream = require('get-stream');

/**
 * Read vinyl file contents
 * @param {catFileOptions} opt [catFileOptions]{@link module:gulp-git/lib/catFile~catFileOptions}
 * @returns {stream}       stream of vinyl `File` objects.
 */
module.exports = function (opt) {
	opt = Object.assign({
		read: true,
		buffer: true,
		stripBOM: true,
	}, opt);
	return through.obj((file, enc, cb) => {
		const hash = file.git && file.git.hash;

		if (!opt.read || !hash || /^0+$/.test(hash)) {
			cb(null, file);
			return;
		}

		let contents = this.spawn(['cat-file', 'blob', hash], file.cwd, opt.config);

		if (opt.stripBOM) {
			contents = contents.pipe(stripBom());
		}

		if (opt.buffer) {
			return getStream.buffer(contents).then(contents => {
				file.contents = contents;
				cb(null, file);
			}).catch(cb);
		}
		file.contents = contents;

		cb(null, file);
	});
};
