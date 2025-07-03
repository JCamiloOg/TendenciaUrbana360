import { axiosInstance } from "../../config.js";

export async function getOrderByID(id) {
    return axiosInstance.get(`clientes/profile/orders/${id}`);
}