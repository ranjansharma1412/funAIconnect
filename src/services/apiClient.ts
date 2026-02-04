import axios, { AxiosInstance } from 'axios';

/**
 * API Configuration
 * TODO: Update BASE_URL with your actual API endpoint
 * For environment-based configuration, consider using react-native-config
 */
const API_CONFIG = {
    BASE_URL: 'https://api.example.com', // Replace with your API URL
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

export { apiClient, API_CONFIG };
