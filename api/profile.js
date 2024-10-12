import { API } from "@/libs/clients";

export const getProfile = async (data) => {
  const res = await API.get(`/profile/me`, data);
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put(`/profile/me`, data);
  return res.data;
};
export const getSuggestions = async (data) => {
  const res = await API.get(`/profile/suggestion`, {
    params: data,
  });
  return res;
};

export const getUser = async (profileId, data) => {
  const res = await API.get(`/profile/${profileId}`, data);
  return res.data;
};

export const checkUnread = async (profileId, data) => {
  const res = await API.post(`/profile/${profileId}/profile/remain_unread`, data);
  return res.data;
}