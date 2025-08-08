import { axiosInstance } from "@/config";

export async function getSizes() {
    return axiosInstance.get(`/admin/sizes`);
}

export async function createSize(data) {
    return axiosInstance.post(`/admin/sizes/create`, data);
}