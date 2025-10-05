const request = require('supertest');
const app = require('../src/index');

describe('Security Testing - Unauthorized access', () => {
	test('rejects creating product without token', async () => {
		const res = await request(app)
			.post('/api/products')
			.send({ name: 'X', description: 'D', type: 'Books', price: 10, quantity: 1 });
		expect(res.status).toBe(401);
	});

	test('rejects accessing my-products without token', async () => {
		const res = await request(app).get('/api/products/my-products');
		expect(res.status).toBe(401);
	});

	test('rejects cart access without token', async () => {
		const res = await request(app).get('/api/users/cart');
		expect(res.status).toBe(401);
	});
});


