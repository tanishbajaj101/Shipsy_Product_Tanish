
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: randomUUID,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    products_created: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
