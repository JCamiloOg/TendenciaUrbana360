import axios from "axios";

// URLS para API
export const API_URL = import.meta.env.VITE_CORS_ORIGIN;

// Configuración base para axios
export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
