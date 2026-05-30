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

export async function profileInfo() {
    return await axiosInstance.get(`/clientes/profile`);
}

export async function sendEmailPassword(data) {
    return await axiosInstance.post(`/clientes/forgotPassword/email`, data);
}

export async function verifyTokenPassword(token) {
    return await axiosInstance.get(`/clientes/forgotPassword/reset?code=${token}`);
}
export async function resetPassword(data) {
    return await axiosInstance.post(`/clientes/resetPassword`, data);
}