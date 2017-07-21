const git = require('../');
const should = require('should');
describe('blame', () => {
	it('file contents are null', () => {
		return git
		.blame({
			path: 'package.json',
			isNull: () => true,
		}).then(blames => {
			blames.forEach(blame => {
				should(blame.rev.author).have.property('name');
				should(blame.rev.author.name).be.a.String();
				should(blame.rev.author).have.property('mail');
				should(blame.rev.author.mail).be.a.String();
				should(blame.rev.author).have.property('time');
				should(blame.rev.author.time).be.a.Number();
				should(blame.rev.committer).have.property('name');
				should(blame.rev.committer.name).be.a.String();
				should(blame.rev.committer).have.property('mail');
				should(blame.rev.committer.mail).be.a.String();
				should(blame.rev.committer).have.property('time');
				should(blame.rev.committer.time).be.a.Number();
			});
		});
	});
});
