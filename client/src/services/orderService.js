import { axiosInstance } from "@/config";

export async function getAdress() {
    return await axiosInstance.get(`/clientes/order/confirmAdress`);
}

export async function getOrder() {
    return await axiosInstance.get(`/clientes/order/confirmOrder`);
}

export async function updateAdress(data) {
    return await axiosInstance.put(`/clientes/order/updateAdress`, data);
}

export async function saveOrder(data) {
    return await axiosInstance.post(`/clientes/order/saveOrder`, data);
}

