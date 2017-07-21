const getStream = require('get-stream');
const split = require('split');
module.exports = module => {
	return function () {
		const {
			args,
			options,
		} = module.args.apply(this, arguments);
		const mapper = module.mapper.bind(this, options);
		const stream = this.spawn(args, options)
			.pipe(split(module.separator, mapper));
		let promise;
		function getPromise() {
			if (!promise) {
				promise = getStream.array(stream);
			}
			return promise;
		}
		return Object.assign(stream, {
			then: (...args) => getPromise().then(...args),
			catch: (...args) => getPromise().catch(...args),
		});
	};
};
