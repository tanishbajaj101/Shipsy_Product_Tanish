const request = require('supertest');
const app = require('../src/index');

describe('Integration E2E - Product CRUD and Cart', () => {
    let token;
    let productId;
    beforeAll(async () => {
        await request(app).post('/api/users/register').send({ username: 'cara', password: 'password123' });
        const login = await request(app).post('/api/users/login').send({ username: 'cara', password: 'password123' });
        token = login.body.token;
    });

    test('happy path: create → list → update → cart ops → delete', async () => {
        // Create product (quantity 2 so cart add succeeds)
        const createRes = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Lamp', description: 'Desk lamp', type: 'Home Goods', price: 25, quantity: 2 });
        expect(createRes.status).toBe(201);
        productId = createRes.body._id;

        // List products
        const listRes = await request(app).get('/api/products');
        expect(listRes.status).toBe(200);

        // My products
        const mineRes = await request(app)
            .get('/api/products/my-products')
            .set('Authorization', `Bearer ${token}`);
        expect(mineRes.status).toBe(200);

        // Update product
        const updateRes = await request(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 30 });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.price).toBe(30);

        // Add to cart
        const addRes = await request(app)
            .post(`/api/users/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(addRes.status).toBe(201);

        // Cart get
        const cartRes = await request(app)
            .get('/api/users/cart')
            .set('Authorization', `Bearer ${token}`);
        expect(cartRes.status).toBe(200);

        // Remove one
        const removeRes = await request(app)
            .delete(`/api/users/cart/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(removeRes.status).toBe(200);

        // Checkout
        const checkoutRes = await request(app)
            .post('/api/users/cart/checkout')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(checkoutRes.status).toBe(200);

        // Delete product
        const deleteRes = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteRes.status).toBe(200);
    });
});


