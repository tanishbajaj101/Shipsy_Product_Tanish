
import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import EditProductModal from '../components/EditProductModal';

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                        <button onClick={() => openModal(product)} className="btn btn-primary">Edit</button>
                    </div>
                ))}
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
