import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.104:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// In-memory token cache to avoid slow AsyncStorage reads on every request
let cachedToken: string | null = null;

export const setCachedToken = (token: string | null) => {
    cachedToken = token;
};

// Request interceptor — attach token from memory cache (falls back to storage)
api.interceptors.request.use(
    async (config) => {
        if (!cachedToken) {
            cachedToken = await AsyncStorage.getItem('token');
        }
        if (cachedToken) {
            config.headers.Authorization = `Bearer ${cachedToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 / refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
                    const newToken = res.data.token;
                    await AsyncStorage.setItem('token', newToken);
                    await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
                    cachedToken = newToken;
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return api(error.config);
                } catch {
                    cachedToken = null;
                    await AsyncStorage.multiRemove(['token', 'refreshToken']);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
