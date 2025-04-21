import axios from "axios";

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})

api.interceptors.request.use(
    (config) => {
        if (!config.url.includes('/login') && !config.url.includes('/register')) {

            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            
        }
        return config
    },
    (error) => Promise.reject(error)
);

export default api