
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const ProductService = require('./product.service');

class CartService {
    constructor() {
        this.productService = new ProductService();
    }

    async get_cart(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        return cart ? cart.items : [];
    }

    async add_to_cart(userId, productId) {
        // Decrease stock atomically first
        await this.productService.decrease_stock_or_throw(productId, 1);

        // Add item in cart collection (unique per user)
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existing = cart.items.find((i) => i.product.toString() === productId);
        if (existing) {
            // Revert stock and disallow duplicates per your requirement
            await this.productService.increase_stock(productId, 1);
            throw new Error('Product already in cart');
        }
        cart.items.push({ product: productId, quantity: 1 });
        await cart.save();

        return await this.get_cart(userId);
    }

    async remove_from_cart(userId, productId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');

        const idx = cart.items.findIndex((i) => i.product.toString() === productId);
        if (idx === -1) throw new Error('Item not in cart');

        // Restore stock for one unit
        await this.productService.increase_stock(productId, 1);

        // Remove the item from cart and save
        cart.items.splice(idx, 1);
        await cart.save();

        return await this.get_cart(userId);
    }

    async clear_cart(userId) {
        // Do not restore stock on checkout; it was reduced when added
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return [];
        cart.items = [];
        await cart.save();
        return [];
    }
}

module.exports = CartService;
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
module.exports.CartService = CartService;
