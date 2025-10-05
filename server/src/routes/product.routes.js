
const express = require('express');
const router = express.Router();
const ProductService = require('../services/product.service');
const AuthManager = require('../services/auth.manager');

const productService = new ProductService();
const authManager = new AuthManager(process.env.JWT_SECRET || 'your_jwt_secret');

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const { type, couponCodeAvailable, sortBy, search } = req.query;
        const filters = { type, couponCodeAvailable };
        const products = await productService.list_all_products(filters, sortBy, search);
        res.json(products);
    } catch (error) {
        console.error('GET /products error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get user's products (protected)
router.get('/my-products', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const products = await productService.list_user_products(req.user.userId);
        res.json(products);
    } catch (error) {
        console.error('GET /products/my-products error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Create a new product (protected)
router.post('/', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const product = await productService.create_product(req.body, req.user.userId);
        console.log(`Product created: ${product.name}`);
        res.status(201).json(product);
    } catch (error) {
        console.error('POST /products error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Update a product (protected)
router.put('/:id', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const product = await productService.update_product(req.params.id, req.body, req.user.userId);
        console.log(`Product updated: ${product.name}`);
        res.json(product);
    } catch (error) {
        console.error('PUT /products/:id error:', error.message);
        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message && error.message.toLowerCase().includes('not authorized')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
});

// Delete a product (protected)
router.delete('/:id', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        await productService.delete_product(req.params.id, req.user.userId);
        console.log(`Product deleted: ${req.params.id}`);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('DELETE /products/:id error:', error.message);
        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message && error.message.toLowerCase().includes('not authorized')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
