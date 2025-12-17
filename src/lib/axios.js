import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    withCredentials: true, // For cookies if needed
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user-storage')
            ? JSON.parse(localStorage.getItem('user-storage')).state.accessToken
            : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
