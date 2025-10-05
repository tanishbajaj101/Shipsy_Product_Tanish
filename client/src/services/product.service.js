
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL + '/products/';

class ProductService {
    getAllProducts(filters, sortBy, searchTerm) {
        return axios.get(API_URL, { params: { ...filters, sortBy, search: searchTerm } });
    }

    getUserProducts() {
        return axios.get(API_URL + 'my-products', { headers: authHeader() });
    }

    createProduct(product) {
        return axios.post(API_URL, product, { headers: authHeader() });
    }

    updateProduct(id, product) {
        return axios.put(API_URL + id, product, { headers: authHeader() });
    }

    deleteProduct(id) {
        return axios.delete(API_URL + id, { headers: authHeader() });
    }
}

export default new ProductService();
