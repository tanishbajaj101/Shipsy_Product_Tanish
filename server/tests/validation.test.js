const request = require('supertest');
const app = require('../src/index');

describe('Validation Testing', () => {
    let token;
    beforeAll(async () => {
        await request(app).post('/api/users/register').send({ username: 'alice', password: 'password123' });
        const login = await request(app).post('/api/users/login').send({ username: 'alice', password: 'password123' });
        token = login.body.token;
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


