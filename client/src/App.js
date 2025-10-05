import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MyProductsPage from './pages/MyProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import CartPage from './pages/CartPage';

const App = () => {
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

    const logOut = () => {
        AuthService.logout();
        // Clear session-scoped cart by hard reload to reset memory and any volatile state
        setCurrentUser(undefined);
    };

    const login = () => {
        setCurrentUser(AuthService.getCurrentUser());
    };

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={'/'} className="navbar-brand">
                        ProductApp
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={'/'} className="nav-link">
                                All Products
                            </Link>
                        </li>

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={'/my-products'} className="nav-link">
                                    My Products
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={'/cart'} className="nav-link">
                                    My Cart
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={'/create-product'} className="nav-link">
                                    Create Product
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={logOut}>
                                    Logout
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={'/login'} className="nav-link">
                                    Login
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={'/register'} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>
                        </div>
                    )}
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route exact path={'/'} element={<HomePage />} />
                        <Route exact path={'/home'} element={<HomePage />} />
                        <Route exact path="/login" element={<LoginPage login={login} />} />
                        <Route exact path="/register" element={<RegisterPage />} />
                        <Route exact path="/my-products" element={<MyProductsPage />} />
                        <Route exact path="/create-product" element={<CreateProductPage />} />
                        <Route exact path="/cart" element={<CartPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;