import { API } from "@/libs/clients";

export const authLogin = async (data) => {
    const res = await API.post(`/signin`, data);
    return res.data;
}

export const authRegister = async (data) => {
    const res = await API.post(`/signup`, data);
    return res.data;
}