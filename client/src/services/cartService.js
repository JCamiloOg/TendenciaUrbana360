import { axiosInstance } from "@/config";

export async function getCart() {
    return await axiosInstance.get(`/products/cart`);
}

export async function saveCart(data) {
    return await axiosInstance.post(`/products/cart/save`, data);
}

export async function getCartStorage() {
    return await axiosInstance.get(`/products/cart/localstorage`);
}

export async function updateTotalAmount(id) {
    if (typeof id === "undefined") return await axiosInstance.get(`/products/cart/totalAmount`)
    else return await axiosInstance.get(`/products/cart/totalAmount?id=${id}`);

}