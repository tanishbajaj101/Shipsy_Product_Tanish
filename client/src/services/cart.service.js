import axios from 'axios';
import authHeader from './auth-header';

const baseUrl = process.env.REACT_APP_API_URL || '/api';
const API_URL = baseUrl + '/users/cart';

class CartService {
    getCart() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    addToCart(productId) {
        return axios.post(`${API_URL}/${productId}`, {}, { headers: authHeader() });
    }

    removeFromCart(productId) {
        return axios.delete(`${API_URL}/${productId}`, { headers: authHeader() });
    }

    checkout() {
        return axios.post(`${baseUrl}/users/cart/checkout`, {}, { headers: authHeader() });
    }
}

const cartService = new CartService();
export default cartService;


