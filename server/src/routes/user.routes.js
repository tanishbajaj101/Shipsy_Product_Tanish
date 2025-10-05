
const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');
const { CartService } = require('../services/user.service');
const AuthManager = require('../services/auth.manager');

const userService = new UserService(process.env.JWT_SECRET || 'your_jwt_secret');
const authManager = new AuthManager(process.env.JWT_SECRET || 'your_jwt_secret');
const cartService = new CartService();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.register(username, password);
        console.log(`User registered: ${username}`);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await userService.login(username, password);
        console.log(`User logged in: ${username}`);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Cart routes (protected)
router.get('/cart', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const items = await cartService.get_cart(req.user.userId);
        res.json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/cart/:productId', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const items = await cartService.add_to_cart(req.user.userId, req.params.productId);
        res.status(201).json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/cart/:productId', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const items = await cartService.remove_from_cart(req.user.userId, req.params.productId);
        res.json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/cart/checkout', authManager.isAuthenticated.bind(authManager), async (req, res) => {
    try {
        const items = await cartService.clear_cart(req.user.userId);
        res.json(items);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
