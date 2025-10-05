
import React, { useState, useEffect } from 'react';

const EditProductModal = ({ product, onUpdate, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [couponCodeAvailable, setCouponCodeAvailable] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setQuantity(product.quantity);
            setCouponCodeAvailable(product.couponCodeAvailable);
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(product._id, { name, description, price, quantity, couponCodeAvailable });
    };

    if (!product) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={couponCodeAvailable} onChange={(e) => setCouponCodeAvailable(e.target.checked)} />
                        <label className="form-check-label">Coupon Available</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
