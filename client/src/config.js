import axios from "axios";

export const API_URL = import.meta.env.VITE_CORS_ORIGIN;
export const IMG_URL = import.meta.env.VITE_IMG_URL;


export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
