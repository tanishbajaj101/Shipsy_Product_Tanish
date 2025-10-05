
import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import CartService from '../services/cart.service';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({ type: '', couponCodeAvailable: '' });
    const [sortBy, setSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedCouponsById, setAppliedCouponsById] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

    const COUPON_DISCOUNT = 0.1; // 10%

    useEffect(() => {
        ProductService.getAllProducts(filters, sortBy, searchTerm)
            .then(response => {
                setProducts(response.data);
                setCurrentPage(1);
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

    const toggleCoupon = (productId) => {
        setAppliedCouponsById((prev) => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    const getDiscountedPrice = (price) => {
        const discounted = Number(price) * (1 - COUPON_DISCOUNT);
        return Math.max(0, discounted).toFixed(2);
    };

    const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
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
                {visibleProducts.map(product => {
                    const isApplied = !!appliedCouponsById[product._id];
                    const showCouponToggle = !!product.couponCodeAvailable;
                    const discounted = getDiscountedPrice(product.price);

                    return (
                        <div key={product._id} className="product-card">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-desc">{product.description}</p>
                            <p className="product-meta">Type: {product.type}</p>
                            <div className="product-price-row">
                                {isApplied ? (
                                    <>
                                        <span className="price-discounted">${discounted}</span>
                                        <span className="price-original">${product.price}</span>
                                    </>
                                ) : (
                                    <span className="price-regular">${product.price}</span>
                                )}
                            </div>
                            <p className="product-qty">Qty: {product.quantity}</p>
                            {showCouponToggle && (
                                <button
                                    type="button"
                                    className={`btn btn-coupon ${isApplied ? 'btn-coupon-active' : ''}`}
                                    onClick={() => toggleCoupon(product._id)}
                                >
                                    {isApplied ? 'Remove Coupon' : 'Apply Coupon'}
                                </button>
                            )}
                            {!showCouponToggle && (
                                <div className="coupon-badge coupon-badge-muted">No Coupon</div>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={product.quantity <= 0}
                                onClick={async () => {
                                    try {
                                        await CartService.addToCart(product._id);
                                        // Refresh products to reflect reduced stock
                                        const res = await ProductService.getAllProducts(filters, sortBy, searchTerm);
                                        setProducts(res.data);
                                    } catch (e) {
                                        console.log(e);
                                        alert(e?.response?.data?.message || 'Failed to add to cart');
                                    }
                                }}
                            >
                                Buy
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="pagination">
                <div className="pagination-controls">
                    <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            className={p === currentPage ? 'active' : ''}
                            onClick={() => goToPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
                </div>
                <div className="pagination-right">
                    <span>
                        {products.length === 0
                            ? '0 of 0'
                            : `${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, products.length)} of ${products.length}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
