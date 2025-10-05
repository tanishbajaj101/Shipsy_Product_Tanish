
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../services/product.service';

const CreateProductPage = (props) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Electronics');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [couponCodeAvailable, setCouponCodeAvailable] = useState(false);

    const handleCreateProduct = (e) => {
        e.preventDefault();

        const newProduct = {
            name,
            description,
            type,
            price,
            quantity,
            couponCodeAvailable
        };

        ProductService.createProduct(newProduct).then(
            () => {
                navigate('/my-products');
                window.location.reload();
            },
            (error) => {
                console.log(error);
            }
        );
    };

    return (
        <div className="container">
            <h1>Create Product</h1>
            <form onSubmit={handleCreateProduct}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select className="form-control" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Home Goods">Home Goods</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" className="form-control" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="couponCodeAvailable" checked={couponCodeAvailable} onChange={(e) => setCouponCodeAvailable(e.target.checked)} />
                    <label className="form-check-label" htmlFor="couponCodeAvailable">Coupon Code Available</label>
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default CreateProductPage;
