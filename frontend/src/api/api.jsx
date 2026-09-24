import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const axiosParam = {
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    crossDomain: true
}

const axiosInstance = axios.create(axiosParam);

// Add a request interceptor to include the token in requests
axiosInstance.interceptors.request.use(
    (config) => {
        let token = sessionStorage.getItem('access_token');
        // Ensure token doesn't have extra spaces and properly formatted
        if (token) {
            token = token.trim();
            // Remove 'Bearer ' prefix if it exists to avoid duplication
            if (token.startsWith('Bearer ')) {
                token = token.substring(7);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const api = (instance) => {
    return {
        get: (url, headers = {}) => instance.get(url, { headers }),
        post: (url, body, headers = {}) => instance.post(url, body, {headers}),
        put: (url, body, headers = {}) => instance.put(url, body, {headers}),
        delete: (url, headers = {}) => instance.delete(url, {headers}),
        patch: (url, body, headers = {}) => instance.patch(url, body, {headers}),
    }
}

export default api(axiosInstance);