
const diff = require('./diff');
const toArgv = require('argv-formatter').format;
const debug = require('debug')('gulp-git:log');

module.exports = {
	separator: /\n?```split_log_start```/,
	mapper: (optiuons, data) => {
		debug(data);
		data = /^(.+?)```split_body_start```([\s\S]*?)\n?```split_body_end```\u0000*(?:\n*([\s\S]*))?\u0000*$/.exec(data);
		if (data) {
			data = Object.assign(JSON.parse(data[1]), {
				body: data[2],
				diff: data[3] ? data[3].split(diff.separator).map(diff.parse) : [],
			});
			data.parent = data.parent.split(/\s+/g);
			return data;
		}
	},
	args: (revision = 'head', options) => {
		options = Object.assign({
			raw: true,
			z: true,
			format: '```split_log_start```{"hash":"%H","tree":"%T","parent":"%P","author":{"name":"%aN","email":"%aE","time":%at},"committer":{"name":"%cN","email":"%cE","time":%ct}}```split_body_start```%B```split_body_end```',
		}, options);
		return {
			options,
			args: ['log'].concat(toArgv(options)).concat(revision),
		};
	},
};
