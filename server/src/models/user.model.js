
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
