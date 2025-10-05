
import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getUserProducts().then(
            (response) => {
                setProducts(response.data);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const handleDelete = (id) => {
        ProductService.deleteProduct(id).then(
            () => {
                setProducts(products.filter(product => product._id !== id));
            },
            (error) => {
                console.log(error);
            }
        );
    };

    return (
        <div className="container">
            <h1>My Products</h1>
            <div className="product-list">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Type: {product.type}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>{product.couponCodeAvailable ? 'Coupon Available' : 'No Coupon'}</p>
                        <button onClick={() => handleDelete(product._id)} className="btn btn-danger">Delete</button>
                        {/* TODO: Add update functionality */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProductsPage;
