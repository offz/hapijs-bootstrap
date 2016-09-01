import chai from 'chai';
const expect = chai.expect;
import utils from '../utils.js';

let server;
before( done => {
	utils.server.init( instance => {
		server = instance;
		utils.resetDb(done);
	});
});

describe('/api/users', () => {
	it('Post with valid email should return user ID.', done => {
		server.inject({
			method: 'POST',
			url: '/api/users',
			payload: {
				email: 'example@mail.com'
			}
		}, res => {
			expect(res.result).to.have.property('user');
			expect(res.result.user).to.be.a('string');
			done();
		});
	});

});