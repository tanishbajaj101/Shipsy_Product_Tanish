
const Product = require('../models/product.model');
const User = require('../models/user.model');

class ProductService {
    async decrease_stock_or_throw(productId, delta = 1) {
        // Atomically decrease quantity ensuring it does not go below 0
        const updated = await Product.findOneAndUpdate(
            { _id: productId, quantity: { $gte: delta } },
            { $inc: { quantity: -delta } },
            { new: true }
        );
        if (!updated) {
            throw new Error('Insufficient quantity');
        }
        return updated;
    }

    async increase_stock(productId, delta = 1) {
        return await Product.findByIdAndUpdate(
            productId,
            { $inc: { quantity: delta } },
            { new: true }
        );
    }

    async create_product(productData, owner_id) {
        const product = new Product({ ...productData, owner_id });
        await product.save();

        // Add product to user's created products list
        await User.findByIdAndUpdate(owner_id, { $push: { products_created: product._id } });

        return product;
    }

    async update_product(productId, productData, userId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.owner_id.toString() !== userId) {
            throw new Error('You are not authorized to update this product');
        }

        return await Product.findByIdAndUpdate(productId, productData, { new: true });
    }

    async delete_product(productId, userId) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.owner_id.toString() !== userId) {
            throw new Error('You are not authorized to delete this product');
        }

        // Remove product from user's created products list
        await User.findByIdAndUpdate(product.owner_id, { $pull: { products_created: product._id } });

        return await Product.findByIdAndDelete(productId);
    }

    async list_user_products(userId) {
        return await Product.find({ owner_id: userId });
    }

    async list_all_products(filters, sortBy, searchTerm) {
        let query = {};

        if (filters) {
            if (filters.type) {
                query.type = filters.type;
            }
            if (filters.couponCodeAvailable) {
                query.couponCodeAvailable = filters.couponCodeAvailable === 'true';
            }
        }

        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' };
        }

        let sortOptions = {};
        if (sortBy) {
            sortOptions.price = sortBy === 'asc' ? 1 : -1;
        }

        return await Product.find(query).sort(sortOptions);
    }
}

module.exports = ProductService;
