import axios from 'axios';
import { getApiBaseUrl } from './apiConfig';

const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
});

const getStoredAuth = () => {
    try {
        const raw = localStorage.getItem('user-storage');
        if (!raw) return null;
        return JSON.parse(raw)?.state || null;
    } catch {
        return null;
    }
};

const setStoredAccessToken = (accessToken) => {
    try {
        const raw = localStorage.getItem('user-storage');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed?.state) return;
        parsed.state.accessToken = accessToken;
        localStorage.setItem('user-storage', JSON.stringify(parsed));
    } catch {
        // ignore storage errors
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const auth = getStoredAuth();
        if (auth?.accessToken) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let refreshPromise = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (
            status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes('/api/auth/refresh') ||
            originalRequest.url?.includes('/api/auth/login') ||
            originalRequest.url?.includes('/api/auth/signup')
        ) {
            return Promise.reject(error);
        }

        const auth = getStoredAuth();
        if (!auth?.refreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axiosInstance
                    .post('/api/auth/refresh', { token: auth.refreshToken })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const refreshRes = await refreshPromise;
            const newAccessToken = refreshRes.data?.accessToken;
            if (!newAccessToken) {
                return Promise.reject(error);
            }

            setStoredAccessToken(newAccessToken);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default axiosInstance;
