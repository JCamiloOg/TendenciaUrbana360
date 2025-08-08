import { axiosInstance } from "@/config";

export async function getClients() {
    return await axiosInstance.get(`/admin/clients`);
}

export async function getClient(id) {
    return await axiosInstance.get(`/admin/clients/${id}`);
}

export async function updateRole(id, data) {
    return await axiosInstance.put(`/admin/clients/updateRol/${id}`, data);
}

export async function updateStatus(id, data) {
    return await axiosInstance.put(`/admin/clients/updateStatus/${id}`, data);
}

export async function updateUser(id, data) {
    return await axiosInstance.put(`/admin/clients/edit/:${id}`, data);
}