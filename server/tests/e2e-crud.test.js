const request = require('supertest');
const app = require('../src/index');
const UserService = require('../src/services/user.service');

describe('Integration E2E - Product CRUD and Cart', () => {
	let token;
	let productId;
	beforeAll(async () => {
		const userService = new UserService(process.env.JWT_SECRET);
		await userService.register('cara', 'password123');
		token = await userService.login('cara', 'password123');
	});

	test('Create product', async () => {
		const res = await request(app)
			.post('/api/products')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Lamp', description: 'Desk lamp', type: 'Home Goods', price: 25, quantity: 3 });
		expect(res.status).toBe(201);
		productId = res.body._id;
		expect(res.body.name).toBe('Lamp');
	});

	test('List all products and my-products', async () => {
		const list = await request(app).get('/api/products');
		expect(list.status).toBe(200);
		const mine = await request(app)
			.get('/api/products/my-products')
			.set('Authorization', `Bearer ${token}`);
		expect(mine.status).toBe(200);
		expect(Array.isArray(mine.body)).toBe(true);
	});

	test('Update product', async () => {
		const res = await request(app)
			.put(`/api/products/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ price: 30 });
		expect(res.status).toBe(200);
		expect(res.body.price).toBe(30);
	});

	test('Add to cart, get cart, remove one, checkout', async () => {
		const add = await request(app)
			.post(`/api/users/cart/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send();
		expect(add.status).toBe(201);
		expect(Array.isArray(add.body)).toBe(true);

		const cart = await request(app)
			.get('/api/users/cart')
			.set('Authorization', `Bearer ${token}`);
		expect(cart.status).toBe(200);
		expect(cart.body.length).toBe(1);

		const remove = await request(app)
			.delete(`/api/users/cart/${productId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(remove.status).toBe(200);

		const checkout = await request(app)
			.post('/api/users/cart/checkout')
			.set('Authorization', `Bearer ${token}`)
			.send();
		expect(checkout.status).toBe(200);
	});

	test('Delete product', async () => {
		const res = await request(app)
			.delete(`/api/products/${productId}`)
			.set('Authorization', `Bearer ${token}`);
		expect(res.status).toBe(200);
		expect(res.body.message).toMatch(/deleted/i);
	});
});


