
import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ type: '', couponCodeAvailable: '' });
    const [sortBy, setSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        ProductService.getAllProducts(filters, sortBy, searchTerm)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [filters, sortBy, searchTerm]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container">
            <h1>All Products</h1>
            <div className="filters">
                <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearchChange} />
                <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home Goods">Home Goods</option>
                </select>
                <select name="couponCodeAvailable" value={filters.couponCodeAvailable} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="true">Coupon Available</option>
                    <option value="false">No Coupon</option>
                </select>
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>
            <div className="product-list">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Type: {product.type}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>{product.couponCodeAvailable ? 'Coupon Available' : 'No Coupon'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
