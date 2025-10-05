
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const AuthManager = require('./auth.manager');

class UserService {
    constructor(secret) {
        this.authManager = new AuthManager(secret);
    }

    async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, hashedPassword });
        await newUser.save();
        return newUser;
    }

    async login(username, password) {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        return this.authManager.login(user);
    }
}

module.exports = UserService;
