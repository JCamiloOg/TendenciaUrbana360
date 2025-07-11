import { axiosInstance } from "../config";

export async function getProducts() {
    return await axiosInstance.get(`/`);
}

export async function getAllProducts() {
    return await axiosInstance.get(`/products`);
}

export async function getProductsByCategory(category) {
    return await axiosInstance.get(`/products/${category}`);

}

export async function getProductByID(type, id) {
    return await axiosInstance.get(`/products/${type}/${id}`)
}
