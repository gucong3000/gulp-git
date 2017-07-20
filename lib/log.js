
const through = require('through2');
const getStream = require('get-stream');

module.exports = function (opt) {
	const stream = through.obj();
	this.spawn(
		[
			'log',
			'-z',
			'--format={"hash":"%H","author":{"name":"%aN","email":"%aE","time":%at},"committer":{"name":"%cN","email":"%cE","time":%ct}}\t```split body```\t%B'
		]
	).on('data', function (data) {
		data.toString().split(/\n\u0000/g).filter(Boolean).forEach(data => {
			data = data.split('\t```split body```\t');
			data = Object.assign(JSON.parse(data[0]), {
				body: data[1]
			});
			stream.push(data);
		});
	})
		.on('error', stream.emit.bind(stream, 'error'))
		.on('end', stream.emit.bind(stream, 'end'));

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
