
const through = require('through2');
const getStream = require('get-stream');
const debug = require('debug')('gulp-git:blame');

function parsePerson(data, result) {
	data.replace(/^\w+-(\w+) (.*)$/gm, (s, key, value) => {
		if (key === 'mail') {
			value = value.replace(/^<(.*)>$/, '$1');
		} else if (key === 'time') {
			value -= 0;
		}
		result[key] = value;
		return '';
	});
	return result;
}

function parseLine(props, result) {
	props.replace(/^(\w+) (.*)(\n(?:\1-\w+ .*\n)+)/gm, (s, role, name, props) => {
		result.rev[role] = parsePerson(props, {
			name
		});
		return '';
	}).replace(/^summary (.*)$/igm, (s, summary) => {
		result.rev.summary = summary;
		return '';
	}).replace(/^previous (\w+) (.*)$/igm, (s, hash, filename) => {
		result.previous = {
			hash,
			filename
		};
		return '';
	}).replace(/^(\S+) (.*)$/gm, (s, key, value) => {
		result[key] = value;
		return '';
	});
	return result;
}

function parseBlame(data, callback) {
	debug(data);
	const revCache = {};
	data.replace(/^(\w{40,}) (\d+) (\d+)(?: \d+)*\n((?:\S*.*\n)*?)\t(.*)$/gm, (s, hash, originalLine, finalLine, props, content) => {
		originalLine -= 0;
		finalLine -= 0;
		callback(parseLine(props, {
			originalLine,
			finalLine,
			content,
			rev: revCache[hash] || (revCache[hash] = {
				hash
			})
		}));
		return '';
	});
}

module.exports = function (file) {
	const args = [
		'blame',
		'-w',
		'-C',
		'-M',
		'-p',
		'--contents',
		'-'
	];
	let input;

	if (file.isNull()) {
		args.length -= 2;
	} else {
		input = file.contents;
	}

	args.push('--', file.path);
	const stream = through.obj();

	this.spawn(args, {
		input,
		cwd: file.cwd
	}).then(data => {
		parseBlame(data.toString(), stream.push.bind(stream));
		stream.end();
	}).catch(stream.emit.bind(stream, 'error'));

	let promise;
	function getPromise() {
		if (!promise) {
			promise = getStream.array(stream);
		}
		return promise;
	}
	return Object.assign(stream, {
		then: (...args) => getPromise().then(...args),
		catch: (...args) => getPromise().catch(...args)
	});
};
