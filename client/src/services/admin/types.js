import { axiosInstance } from "@/config";

export async function getTypes() {
    return axiosInstance.get(`/admin/types`);
}

export async function createType(data) {
    return axiosInstance.post(`/admin/types/create`, data)
}