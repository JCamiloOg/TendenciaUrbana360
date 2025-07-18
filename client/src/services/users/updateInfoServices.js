import { axiosInstance } from "@/config";

export async function checkAuth(data) {
    return await axiosInstance.get(`/clientes/profile/checkAuth?redirect=${data}`);
}

export async function modify(token, type) {
    return await axiosInstance.get(`/clientes/profile/modify?code=${token}&type=${type}`);
}

export async function updateInfo(data) {
    return await axiosInstance.put(`/clientes/profile/changeInfo`, data);
}