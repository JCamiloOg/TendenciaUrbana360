import { axiosInstance } from "@/config";

// GET
export async function getProducts(category) {
    return await axiosInstance.get(`/admin/${category}`)
}

export async function getProduct(id, category) {
    return await axiosInstance.get(`/admin/${category}/${id}`)
}

export async function getSizesForProduct(category, id) {
    return await axiosInstance.get(`/admin/${category}/sizesProduct/${id}`)
}

export async function getExtraInfoForProduct(id, category) {
    return await axiosInstance.get(`/admin/${category}/extra/${id}`)
}

export async function getExtraInfoForModel(id, category) {
    return await axiosInstance.get(`/admin/${category}/extra/model/${id}`)

}

// POST
export async function addProducto(data, category) {
    return await axiosInstance.post(`/admin/${category}/create`, data)
}

export async function createSizeForProduct(data, category) {
    return await axiosInstance.post(`/admin/${category}/sizes/create`, data)
}

export async function updateImage(data, category) {
    return await axiosInstance.post(`/admin/${category}/extra/update/image`, data)
}

export async function addModel(data, category) {
    return await axiosInstance.post(`admin/${category}/extra/create`, data);
}

// PUT
export async function updateProduct(id, data, category) {
    return await axiosInstance.put(`/admin/${category}/update/${id}`, data)
}

export async function changeStatusProduct(id, data, category) {
    return await axiosInstance.put(`/admin/${category}/changeStatus/${id}`, data)
}

export async function updateModel(id, category, data) {
    return await axiosInstance.put(`/admin/${category}/extra/update/${id}`, data)
}

// DELETE
export async function deleteSizeForProduct(id, category) {
    return await axiosInstance.delete(`/admin/${category}/deleteSize/${id}`);
}