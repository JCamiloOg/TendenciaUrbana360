import { axiosInstance } from "@/config";

export async function getColors() {
    return await axiosInstance.get("/admin/colors");
}

export async function createColor(data) {
    return await axiosInstance.post("/admin/colors/create", data);
}