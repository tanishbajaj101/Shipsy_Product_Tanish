
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Home Goods'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    couponCodeAvailable: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
