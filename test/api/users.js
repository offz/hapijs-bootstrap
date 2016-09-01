import chai from 'chai';
const expect = chai.expect;
import utils from '../utils.js';
import User from '../../src/lib/models/User.js';

let server;
before( done => {
	utils.server.init( instance => {
		server = instance;
		utils.resetDb(done);
	});
});

describe('/api/users', () => {

	it('Post with valid email should return code 200 and user ID.', done => {
		server.inject({
			method: 'POST',
			url: '/api/users',
			payload: {
				email: 'example@mail.com'
			}
		}, res => {
			expect(res.statusCode).to.be.equal(200);
			done();
		});
	});

	let testUser;

	it('Update password with token should return 204.', done => {

		User
		.findOneAsync({})
		.then( user => {
			testUser = user;
			server.inject({
				method: 'POST',
				url: `/api/users/${testUser.id}/password`,
				payload: {
					passwordResetToken: testUser.passwordResetToken,
					password: 'password123'
				}
			}, res => {
				expect(res.statusCode).to.be.equal(204);
				done();
			});
		});
	});

	it('Update password with same password should return 400.', done => {
		server.inject({
			method: 'POST',
			url: `/api/users/${testUser.id}/password`,
			payload: {
				passwordResetToken: testUser.passwordResetToken,
				password: 'password123'
			}
		}, res => {
			expect(res.statusCode).to.be.equal(400);
			done();
		});
	});

	it('Update password with wrong token should return 401.', done => {
		server.inject({
			method: 'POST',
			url: `/api/users/${testUser.id}/password`,
			payload: {
				passwordResetToken: 'bad-token',
				password: 'password123'
			}
		}, res => {
			expect(res.statusCode).to.be.equal(401);
			done();
		});
	});

	it('Post with same email should return code 400.', done => {
		server.inject({
			method: 'POST',
			url: '/api/users',
			payload: {
				email: 'example@mail.com'
			}
		}, res => {
			expect(res.statusCode).to.be.equal(400);
			done();
		});
	});

	it('Post with invalid email should return code 400.', done => {
		server.inject({
			method: 'POST',
			url: '/api/users',
			payload: {
				email: 'example@mail-is-not-valid'
			}
		}, res => {
			expect(res.statusCode).to.be.equal(400);
			done();
		});
	});

});