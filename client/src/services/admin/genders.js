import { axiosInstance } from "@/config";

export async function getGenders() {
    return await axiosInstance.get("/admin/genders")
}

export async function createGender(data) {
    return await axiosInstance.post("/admin/genders/create", data)
}