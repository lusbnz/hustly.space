import { API } from "@/libs/clients";

export const getThread = async (profileId, data) => {
    const res = await API.get(`/profile/${profileId}/thread`, data);
    return res.data;
}

export const createThread = async (profileId, data) => {
    const res = await API.post(`/profile/${profileId}/thread`, data);
    return res.data;
}

export const updateThread = async (profileId, threadId, data) => {
    const res = await API.put(`/profile/${profileId}/thread/${threadId}`, data);
    return res.data;
}

export const deleteThread = async (profileId, threadId, data) => {
    const res = await API.delete(`/profile/${profileId}/thread/${threadId}`, data);
    return res.data;
}

export const checkThread = async (profileId, data) => {
    const res = await API.post(`/profile/${profileId}/thread/check`, data);
    return res.data;
}