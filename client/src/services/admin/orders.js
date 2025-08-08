import { axiosInstance } from "@/config";

export async function getOrders() {
    return axiosInstance.get("/admin/orders");
}

export async function getDetailOrder(id) {
    return axiosInstance.get(`/admin/orders/detailorder/${id}`);
}

export async function changeStatus(id, data) {
    return axiosInstance.put(`/admin/orders/changestatus/${id}`, data);
}