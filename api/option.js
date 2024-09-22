import { API } from "@/libs/clients";

export const getCompetion = async (data) => {
    const res = await API.get(`/competition`, data);
    return res.data;
}

export const getUniversity = async (data) => {
    const res = await API.get(`/university`, data);
    return res.data;
}

export const getDomain = async (data) => {
    const res = await API.get(`/domain`, data);
    return res.data;
}