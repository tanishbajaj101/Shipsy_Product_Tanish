
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 5000
    },
    type: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Home Goods'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    couponCode: {
        type: String,
        enum: ['10%', '15%', '20%'],
        default: '15%',
        required: false
    },
    couponCodeAvailable: {
        type: Boolean,
        default: false,
        required: false
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
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
