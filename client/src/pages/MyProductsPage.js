
import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import EditProductModal from '../components/EditProductModal';

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appliedCouponsById, setAppliedCouponsById] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

    const COUPON_DISCOUNT = 0.1; // 10%

    useEffect(() => {
        ProductService.getUserProducts().then(
            (response) => {
                setProducts(response.data);
                setCurrentPage(1);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const handleDelete = (id) => {
        ProductService.deleteProduct(id).then(
            () => {
                const next = products.filter(product => product._id !== id);
                setProducts(next);
                // ensure current page is valid after deletion
                const totalPagesAfter = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
                if (currentPage > totalPagesAfter) {
                    setCurrentPage(totalPagesAfter);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleUpdate = (id, updatedProduct) => {
        ProductService.updateProduct(id, updatedProduct).then(
            (response) => {
                setProducts(products.map(product => (product._id === id ? response.data : product)));
                setIsModalOpen(false);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
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
            <h1>My Products</h1>
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
                            <div className="actions-row">
                                <button onClick={() => handleDelete(product._id)} className="btn btn-danger">Delete</button>
                                <button onClick={() => openModal(product)} className="btn btn-primary">Edit</button>
                            </div>
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
            {isModalOpen && (
                <EditProductModal
                    product={selectedProduct}
                    onUpdate={handleUpdate}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default MyProductsPage;
