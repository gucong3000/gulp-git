const git = require('../');
const should = require('should');
describe('log', () => {
	it('basic', () => {
		return git.log()
		.then(logs => {
			logs.forEach(log => {
				should(log.hash).be.a.String().and.have.lengthOf(40);
				should(log.parent).be.an.Array();
				if (log.hash !== '2ad891e159de11ce5f83af3dae92e26a9d10f4ea') {
					log.parent.forEach(parent => {
						should(parent).be.a.String().and.have.lengthOf(40);
					});
				}
				should(log.tree).be.a.String().and.have.lengthOf(40);
				should(log.author).have.property('name');
				should(log.author.name).be.a.String();
				should(log.author).have.property('email');
				should(log.author.email).be.a.String();
				should(log.author).have.property('time');
				should(log.author.time).be.a.Number();
				should(log.committer).have.property('name');
				should(log.committer.name).be.a.String();
				should(log.committer).have.property('email');
				should(log.committer.email).be.a.String();
				should(log.committer).have.property('time');
				should(log.committer.time).be.a.Number();
				should(log.body).be.an.String();
				should(log.diff).be.an.Array();
				log.diff.forEach(file => {
					should(file.srcMode).be.a.Number();
					should(file.dstMode).be.a.Number();
					should(file.srcHash).be.a.String();
					should(file.dstHash).be.a.String();
					should(file.status).be.a.String();
					should(file.srcPath).be.a.String();
					should(file.dstPath).be.a.String();
				});
			});
		});
	});
});
