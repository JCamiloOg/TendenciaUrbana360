import { axiosInstance } from "../config";

export async function getProducts() {
    return await axiosInstance.get(`/`);
}

export async function getAllProducts() {
    return await axiosInstance.get(`/products`);
}
