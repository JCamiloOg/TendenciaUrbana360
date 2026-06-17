import { axiosInstance } from "@/config";

export async function getAdress(cart) {
    return await axiosInstance.post(`/clientes/order/confirmAdress`, { cart });
}

export async function getOrder(cart) {
    return await axiosInstance.post(`/clientes/order/confirmOrder`, { cart });
}

export async function updateAdress(data) {
    return await axiosInstance.put(`/clientes/order/updateAdress`, data);
}

export async function saveOrder(cart) {
    return await axiosInstance.post(`/clientes/order/saveOrder`, { cart });
}

