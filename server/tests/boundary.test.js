const request = require('supertest');
const app = require('../src/index');

describe('Boundary Testing', () => {
    let token;
    beforeAll(async () => {
        await request(app).post('/api/users/register').send({ username: 'bob', password: 'password123' });
        const login = await request(app).post('/api/users/login').send({ username: 'bob', password: 'password123' });
        token = login.body.token;
    });

	test('list products supports filtering and search boundaries', async () => {
		const res = await request(app).get('/api/products?type=Electronics&couponCodeAvailable=true&search=x');
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});


