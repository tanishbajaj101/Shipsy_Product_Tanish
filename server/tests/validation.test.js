const request = require('supertest');
const app = require('../src/index');
const UserService = require('../src/services/user.service');

describe('Validation Testing', () => {
	let token;
	beforeAll(async () => {
		const userService = new UserService(process.env.JWT_SECRET);
		await userService.register('alice', 'password123');
		token = await userService.login('alice', 'password123');
	});

	test('rejects missing required fields on product create', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'NoDesc' });
		expect(res.status).toBe(400);
		expect(res.body.message).toBeTruthy();
	});

	test('rejects invalid enum for type', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Gadget',
				description: 'Nice gadget',
				type: 'Food',
				price: 10,
				quantity: 5
			});
		expect(res.status).toBe(400);
		expect(res.body.message).toMatch(/validation/i);
	});

	test('rejects quantity below minimum', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Book',
				description: 'A book',
				type: 'Books',
				price: 10,
				quantity: 0
			});
		expect(res.status).toBe(400);
	});
});


