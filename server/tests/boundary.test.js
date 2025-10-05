const request = require('supertest');
const app = require('../src/index');
const UserService = require('../src/services/user.service');

describe('Boundary Testing', () => {
	let token;
	beforeAll(async () => {
		const userService = new UserService(process.env.JWT_SECRET);
		await userService.register('bob', 'password123');
		token = await userService.login('bob', 'password123');
	});

	test('list products supports filtering and search boundaries', async () => {
		const res = await request(app).get('/api/products?type=Electronics&couponCodeAvailable=true&search=x');
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	test('stock edge: cannot add to cart beyond quantity', async () => {
		// Create product with quantity 1
		const create = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Solo', description: 'one', type: 'Electronics', price: 10, quantity: 1 });
		expect(create.status).toBe(201);
		const productId = create.body._id;

		// First add succeeds
		const add1 = await request(app)
			.post(`/api/users/cart/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send();
		expect(add1.status).toBe(201);

		// Second add fails due to stock
		const add2 = await request(app)
			.post(`/api/users/cart/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send();
		expect(add2.status).toBe(400);
		expect(add2.body.message).toMatch(/Insufficient quantity/i);
	});
});


