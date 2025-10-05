
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL || '/api';
const API_URL = baseUrl + '/users/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'login', {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(username, password) {
        return axios.post(API_URL + 'register', {
            username,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

const authService = new AuthService();
export default authService;
