import { API } from "@/libs/clients";

export const uploadFile = async (data) => {
    const res = await API.post(`/upload_file`, data);
    return res.data;
}