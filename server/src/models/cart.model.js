const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

cartSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;


