import axios from 'axios';
import { getApiBaseUrl } from './apiConfig';
import {
  clearStoredSession,
  getStoredAuth,
  isStaleSessionError,
  setStoredAccessToken,
} from './authStorage';

const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
});

let getStore = () => null;
let setStoreState = () => {};

export function bindAuthStore(readStore, writeStore) {
  getStore = readStore;
  setStoreState = writeStore;
}

const getAccessToken = () => {
    const fromStore = getStore?.()?.accessToken;
    if (fromStore) return fromStore;
    return getStoredAuth()?.accessToken || null;
};

const getRefreshToken = () => {
    const fromStore = getStore?.()?.refreshToken;
    if (fromStore) return fromStore;
    return getStoredAuth()?.refreshToken || null;
};

const clearStaleSession = () => {
    clearStoredSession();
    const store = getStore?.();
    if (store?.clearSession) {
        store.clearSession();
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
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

        if (isStaleSessionError(error)) {
            clearStaleSession();
            return Promise.reject(error);
        }

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

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearStaleSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = axiosInstance
                    .post('/api/auth/refresh', { token: refreshToken })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const refreshRes = await refreshPromise;
            const newAccessToken = refreshRes.data?.accessToken;
            if (!newAccessToken) {
                clearStaleSession();
                return Promise.reject(error);
            }

            setStoredAccessToken(newAccessToken);
            setStoreState({ accessToken: newAccessToken, isAuthenticated: true });
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            clearStaleSession();
            return Promise.reject(refreshError);
        }
    }
);

export default axiosInstance;
