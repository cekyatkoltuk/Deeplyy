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

// Request interceptor — attach token from storage
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
                    await AsyncStorage.setItem('token', res.data.token);
                    await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
                    error.config.headers.Authorization = `Bearer ${res.data.token}`;
                    return api(error.config);
                } catch {
                    await AsyncStorage.multiRemove(['token', 'refreshToken']);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
