import React, { useEffect, useMemo, useState } from 'react';
import CartService from '../services/cart.service';

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await CartService.getCart();
            setItems(res.data || []);
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const total = useMemo(() => {
        return (items || []).reduce((sum, item) => {
            const price = item?.product?.price || 0;
            const qty = item?.quantity || 0;
            return sum + price * qty;
        }, 0);
    }, [items]);

    const decrement = async (productId) => {
        try {
            await CartService.removeFromCart(productId);
            await load();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || 'Failed to decrease quantity');
        }
    };

    const increment = async (productId) => {
        try {
            await CartService.addToCart(productId);
            await load();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || 'Failed to increase quantity');
        }
    };

    const checkout = async () => {
        try {
            await CartService.checkout();
            await load();
            alert('Purchase successful. Cart cleared.');
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || 'Failed to checkout');
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h1>My Cart</h1>
            {(!items || items.length === 0) ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="product-list">
                        {items.map((item) => (
                            <div key={item.product._id} className="product-card">
                                <h3 className="product-title">{item.product.name}</h3>
                                <p className="product-desc">{item.product.description}</p>
                                <p className="product-meta">Type: {item.product.type}</p>
                                <div className="product-price-row">
                                    <span className="price-regular">${item.product.price}</span>
                                </div>
                                <div className="qty-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => decrement(item.product._id)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        type="button"
                                        className="btn"
                                        disabled={(item?.product?.quantity || 0) <= 0}
                                        onClick={() => increment(item.product._id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <button className="btn btn-success" onClick={checkout}>Buy</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;


