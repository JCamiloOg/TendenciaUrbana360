import { axiosInstance } from "../../config.js";

export async function login(data) {
    return await axiosInstance.post(`/clientes/login`, data);
}

export async function register(data) {
    return await axiosInstance.post(`/clientes/register`, data)
}

export async function completeInfo(data) {
    return await axiosInstance.put(`/clientes/completeInfo`, data);
}

export async function logOut() {
    return await axiosInstance.get(`/clientes/logout`);
}

export async function checkUser() {
    return await axiosInstance.get(`/clientes/checkuser`);
}

export async function profileInfo() {
    return await axiosInstance.get(`/clientes/profile`);
}