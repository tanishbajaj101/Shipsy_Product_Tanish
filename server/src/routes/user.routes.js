
const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');

const userService = new UserService(process.env.JWT_SECRET || 'your_jwt_secret');

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

module.exports = router;
