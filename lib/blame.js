
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
			name,
		});
		return '';
	}).replace(/^summary (.*)$/igm, (s, summary) => {
		result.rev.summary = summary;
		return '';
	}).replace(/^previous (\w+) (.*)$/igm, (s, hash, filename) => {
		result.previous = {
			hash,
			filename,
		};
		return '';
	}).replace(/^(\S+) (.*)$/gm, (s, key, value) => {
		result[key] = value;
		return '';
	});
	return result;
}

function parseBlame(data, revCache) {
	debug(data);
	data = /^(\w{40,}) (\d+) (\d+)(?: \d+)*\n((?:\S*.*\n)*?)\t(.*)$/gm.exec(data);
	const hash = data[1];
	const rev = revCache[hash] || (revCache[hash] = {
		hash,
	});

	return parseLine(data[4], {
		originalLine: data[2] - 0,
		finalLine: data[3] - 0,
		content: data[5],
		rev,
	});
}

module.exports = {
	separator: /^(?=\w{40,}(?:\s+\d+){2,})/gm,
	mapper(options, data) {
		return parseBlame(data, options.revCache);
	},
	args(file, options) {
		options = Object.assign({
			cwd: file.cwd,
		}, options);

		const args = [
			'blame',
			'-w',
			'-C',
			'-M',
			'-p',
			'--contents',
			'-',
		];

		let input;

		if (file.isNull()) {
			args.length -= 2;
		} else {
			input = file.contents;
		}

		args.push('--', file.path);

		return {
			args,
			options: Object.assign(options, {
				revCache: {},
				input,
			}),
		};
	},
};
